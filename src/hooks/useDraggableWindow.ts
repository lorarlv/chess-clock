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

  const windowRef = useRef<HTMLDivElement | null>(null);

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
    if (!isDragging || !windowRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStart.current.pointerX;

    const deltaY = event.clientY - dragStart.current.pointerY;

    const nextX = dragStart.current.windowX + deltaX;

    const nextY = dragStart.current.windowY + deltaY;

    const rect = windowRef.current.getBoundingClientRect();

    const visibleX = 100;
    const titleBarHeight = 30;

    const maxX = window.innerWidth - visibleX;

    const minX = -(rect.width - visibleX);

    const maxY = window.innerHeight - titleBarHeight;

    const minY = 0;

    setWindowPosition({
      x: Math.min(Math.max(nextX, minX), maxX),
      y: Math.min(Math.max(nextY, minY), maxY),
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
    windowRef,
    windowPosition,
    isDragging,
    startDragging,
    dragWindow,
    stopDragging,
  };
}