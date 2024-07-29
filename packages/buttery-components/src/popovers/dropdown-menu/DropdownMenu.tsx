import {
  type RefCallback,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import {
  type DropdownOptions,
  type DropdownRef,
  type DropdownRefHandleOpen,
  useDropdown,
  usePortal,
} from "../../hooks";
import { classes } from "../../utils";

export type DropdownMenuPropsNative = JSX.IntrinsicElements["div"] & {
  options: DropdownOptions;
};
export type DropdownMenuProps = DropdownMenuPropsNative;

type EventKeyboard = ((e: KeyboardEvent) => void) | null;
type EventMouse = ((e: MouseEvent) => void) | null;

export const DropdownMenu = forwardRef<DropdownRef, DropdownMenuProps>(
  function DropdownMenu({ children, options, className, ...restProps }, ref) {
    const { Portal, openPortal, closePortal } = usePortal();
    const {
      setDropdownRef,
      dropdownRef,
      targetRef,
      closeDropdown,
      openDropdown,
    } = useDropdown<HTMLElement>(options);

    const windowListenerKey = useRef<EventKeyboard>(null);
    const windowListenerMouse = useRef<EventMouse>(null);

    const handleClose = useCallback(() => {
      // close the dropdown
      closeDropdown();
      // remove event listeners
      if (!windowListenerKey.current || !windowListenerMouse.current) return;
      window.removeEventListener("keydown", windowListenerKey.current);
      window.removeEventListener("click", windowListenerMouse.current);
      // close the portal afterwards
      closePortal();
    }, [closePortal, closeDropdown]);

    useImperativeHandle(ref, () => ({
      handleOpen: openPortal,
      handleClose,
      handleToggle: (_e, options) => {
        // this means that the popover is open
        if (dropdownRef.current) {
          handleClose();
          // popover doesn't exist, thus is closed
        } else {
          openPortal();
        }
      },
    }));

    // when the portal opens, the div will mount and the popover ref callback will run
    const articleRef = useCallback<RefCallback<HTMLDivElement>>(
      (node) => {
        // open the dropdown
        setDropdownRef(node);

        openDropdown();

        // add event listeners
        windowListenerKey.current = (e) => {
          if (e.key !== "Escape") return;
          handleClose();
        };
        windowListenerMouse.current = (e) => {
          const clickedElement = e.target as HTMLElement;
          if (
            dropdownRef.current?.contains(clickedElement) ||
            targetRef.current?.contains(clickedElement)
          ) {
            // clicked either on a child of the popover or the
            // target that launched the menu. Do nothing here.
            return;
          }
          handleClose();
        };
        window.addEventListener("keydown", windowListenerKey.current);
        window.addEventListener("click", windowListenerMouse.current);
      },
      [handleClose, targetRef, dropdownRef, setDropdownRef, openDropdown]
    );

    return (
      <Portal>
        <article {...restProps} className={classes(className)} ref={articleRef}>
          {children}
        </article>
      </Portal>
    );
  }
);
