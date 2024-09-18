import { useCallback, useRef } from "react";
export function ensurePopover(node) {
    if (node === null) {
        console.warn("The `popoverRef` has not been correctly initialized. Ensure that you run the `setPopoverRef` as a RefCallback");
    }
    return node !== null;
}
export function ensureTarget(node) {
    if (node === null) {
        console.warn("The `targetRef` has not been correctly initialized. Ensure that you run the `setTargetRef` as a RefCallback");
    }
    return node !== null;
}
export const usePopover = ({ id }) => {
    const popoverRef = useRef(null);
    const targetRef = useRef(null);
    const setTargetRef = useCallback((node) => {
        if (!node)
            return;
        targetRef.current = node;
        targetRef.current.type = "button";
        targetRef.current.setAttribute("aria-controls", id);
        targetRef.current.setAttribute("aria-expanded", "false");
    }, [id]);
    const setPopoverRef = useCallback((node) => {
        if (!node)
            return;
        popoverRef.current = node;
        popoverRef.current.popover = "manual";
        popoverRef.current.id = id;
        const popoverId = popoverRef.current.id;
        if (targetRef.current)
            return; // targetRef already exists, we don't need to find it
        if (!popoverId) {
            throw new Error("The Popover does not have an id. This will lead to accessibility issues. Please sure that the popover has an ID attribute.");
        }
        const targetElement = document.querySelector(`[aria-controls='${popoverId}']`);
        if (!targetElement || targetElement.tagName !== "BUTTON") {
            throw new Error(`Cannot locate the target element that launches the popover. Please ensure you have added the 'aria-controls=${popoverId}' attribute to the button that controls the popover.`);
        }
        setTargetRef(targetElement);
    }, [id, setTargetRef]);
    const showPopover = useCallback(() => {
        if (!ensurePopover(popoverRef.current))
            return;
        popoverRef.current.showPopover();
        popoverRef.current.ariaExpanded = "true";
        if (popoverRef.current.classList.contains("close")) {
            popoverRef.current.classList.replace("close", "open");
        }
        else {
            popoverRef.current.classList.add("open");
        }
        if (ensureTarget(targetRef.current)) {
            targetRef.current.ariaExpanded = "true";
        }
    }, []);
    const hidePopover = useCallback(async () => {
        if (!ensurePopover(popoverRef.current))
            return;
        popoverRef.current.ariaExpanded = "false";
        // add the close class to make any transitions associated with
        popoverRef.current.classList.replace("open", "close");
        const animations = popoverRef.current.getAnimations({
            subtree: true
        });
        // wait for all of the animations to run with .close
        await Promise.allSettled(animations.map((animation) => animation.finished));
        // hide the popover when the animations complete
        popoverRef.current.hidePopover();
        if (ensureTarget(targetRef.current)) {
            targetRef.current.ariaExpanded = "false";
        }
    }, []);
    return {
        popoverRef,
        targetRef,
        setPopoverRef,
        setTargetRef,
        showPopover,
        hidePopover
    };
};
