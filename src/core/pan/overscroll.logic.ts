import { ReactZoomPanPinchContext } from "../../models";
import { getContext } from "../../utils";
import {
  isOverscrollBehaviourAllowedYAxis,
  isOverscrollBehaviourAllowed,
} from "./panning.utils";

// determine if preventDefault and stopPropagation should be called
// This is depending on if the bounds of the image are reached and in which direction the user wants to scroll
export function handleOverscrollBehaviour(contextInstance: ReactZoomPanPinchContext, event: TouchEvent): void {
  if (
    !isOverscrollBehaviourAllowed(contextInstance)
    || !contextInstance.bounds
    || contextInstance.startCoords === null
    || !contextInstance.wrapperComponent
  ) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const { positionY/*, positionX, previousPositionX, previousPositionY*/ } = getContext(contextInstance).state;

  // TODO: Do I need to use min/max-X/Y bounds here? The values seem to be wrong?
  const clientHeight = contextInstance.wrapperComponent.clientHeight;
  // const clientWidth = contextInstance.wrapperComponent.clientWidth;

  const scrollHeight = contextInstance.wrapperComponent.scrollHeight;
  // const scrollWidth = contextInstance.wrapperComponent.scrollWidth;

  const { /*x: startX, */y: startY } = contextInstance.startCoords;

  // const touchDeltaX = event.touches[0].clientX - positionX - startX;
  const touchDeltaY = event.touches[0].clientY - positionY - startY;

  // const componentDirection = calculateDirection({ x: positionX, y: positionY, prevX: previousPositionX, prevY: previousPositionY });

  // TODO: startCoords are touch x position - positionX which comes from transformState. Can I calculate that backwards?
  //  const { positionX, positionY } = contextInstance.transformState;
  //  const x = touches[0].clientX;
  //  const y = touches[0].clientY;
  //  contextInstance.startCoords = { x: x - positionX, y: y - positionY };
  // const touchDirection = calculateDirection({ x: event.touches[0].clientX, y: event.touches[0].clientY, prevX: (positionX + startX), prevY: (positionY + startY) });

  // console.log({ componentDirection, touchDirection });

  const minY = 0;
  const maxY = scrollHeight - clientHeight;

  // const minX = 0;
  // const maxX = scrollWidth - clientWidth;

  const yRounded = Math.round(positionY * -1);
  // const xRounded = Math.round(positionX * -1);

  const isOverscrollYAxisAllowed = isOverscrollBehaviourAllowedYAxis(contextInstance);
  // const isOverscrollXAxisAllowed = isOverscrollBehaviourAllowedXAxis(contextInstance);

  // console.log({ Y: isOverscrollYAxisAllowed, X: isOverscrollXAxisAllowed });

  // Reached Top Boundary
  if (touchDeltaY > 0 && yRounded <= minY && isOverscrollYAxisAllowed) {
    return;
  }

  // Reached Bottom Boundary
  if (touchDeltaY < 0 && yRounded >= maxY && isOverscrollYAxisAllowed) {
    return;
  }

  /**
   * TODO: I have to find a good way to ignore one axis if there is nothing to scroll in a parent element.
   *  Because currently it unlocks scrolling all the time if it is e.g. full-width
   *  Option 1: Currently I use touch position to determine direction. This is a problem since I get a direction even
   *  though my Component isn't able to move in that direction. I should use the component position instead.
   *  If it isn't able to move in a direction, I void the direction.
   */

  // // Reached Left Boundary
  // if (deltaX > 0 && xRounded <= minX && isOverscrollXAxisAllowed) {
  //   return;
  // }
  //
  // // Reached Right Boundary
  // if (deltaX < 0 && xRounded >= maxX && isOverscrollXAxisAllowed) {
  //   return;
  // }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}