import { useRef, useState } from "react";

import type { PointerEvent as ReactPointerEvent } from "react";

export function useDraggableWindow() {
  const [windowPosition, setWindowPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({
    pointerX: 0,
    pointerY: 0,
    windowX: 0,
    windowY: 0,
  });

  function startDragging(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      (event.target as HTMLElement).closest(".window-buttons")
    ) {
      return;
    }

    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      windowX: windowPosition.x,
      windowY: windowPosition.y,
    };

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragWindow(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    const deltaX =
      event.clientX -
      dragStart.current.pointerX;

    const deltaY =
      event.clientY -
      dragStart.current.pointerY;

    setWindowPosition({
      x: dragStart.current.windowX + deltaX,
      y: dragStart.current.windowY + deltaY,
    });
  }

  function stopDragging(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  }

  return {
    windowPosition,
    isDragging,
    startDragging,
    dragWindow,
    stopDragging,
  };
}