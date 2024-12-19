import { type RefCallback, useCallback, useMemo } from "react";

import type { FocusableElement } from "@BUTTERY_COMPONENT/usePopover/usePopover.js";
import { usePopover } from "@BUTTERY_COMPONENT/usePopover/usePopover.js";
import {
  ensurePopover,
  ensureTarget,
} from "@BUTTERY_COMPONENT/usePopover/use-popover.utils.js";

import type { DropdownOptions } from "./useDropdown.types.js";
import {
  processDropdownOptions,
  setDropdownPositionStyles,
} from "./useDropdown.utils.js";

export type UseDropdownHandleOpen = (e?: React.MouseEvent) => void;

export type DropdownRef = {
  handleOpen: UseDropdownHandleOpen;
  handleClose: () => void;
};

export type UseDropdownOptions = DropdownOptions & { id: string };

export const useDropdown = <
  DropdownNode extends HTMLElement,
  TargetNode extends FocusableElement
>(
  options: UseDropdownOptions
) => {
  const {
    popoverRef,
    targetRef,
    setPopoverRef,
    setTargetRef,
    showPopover,
    hidePopover,
  } = usePopover<DropdownNode, TargetNode>({ id: options.id });

  const memoOptions = useMemo(() => options, [options]);

  const setDropdownRef = useCallback<RefCallback<DropdownNode>>(
    (node) => {
      if (!node) return;

      // TODO: Refine this to include strategy
      node.style.position = "fixed";
      node.style.inset = "unset";
      setPopoverRef(node);
    },
    [setPopoverRef]
  );

  const openDropdown = useCallback<UseDropdownHandleOpen>(() => {
    const popover = popoverRef.current;
    const target = targetRef.current;
    if (!ensurePopover(popover) || !ensureTarget(target)) return;

    // apply the options either from the hook or
    // from the params which take precedence.
    const parsedOptions = processDropdownOptions(memoOptions);

    // position the dropdown element near the target
    setDropdownPositionStyles(parsedOptions.dxPosition, {
      arrow: parsedOptions.dxArrow,
      offset: parsedOptions.dxOffset,
      dropdownNode: popover,
      targetNode: target,
    });

    // show the popover
    showPopover();
  }, [popoverRef, targetRef, memoOptions, showPopover]);

  return useMemo(
    () => ({
      dropdownRef: popoverRef,
      setDropdownRef,
      targetRef,
      setTargetRef,
      closeDropdown: hidePopover,
      openDropdown,
    }),
    [
      hidePopover,
      openDropdown,
      popoverRef,
      setDropdownRef,
      setTargetRef,
      targetRef,
    ]
  );
};
