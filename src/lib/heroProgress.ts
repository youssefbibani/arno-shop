/**
 * Mutable, non-reactive store for the hero cup's interaction + scroll
 * transition. GSAP and pointer handlers write to it every tick; the R3F
 * scene reads it inside useFrame. Avoids React re-renders driving 60fps
 * scroll/drag animation.
 */
export const heroProgress = {
  value: 0, // 0 = hero rest state, 1 = fully transitioned to side
  pointerNX: 0, // -1..1 normalized pointer position over the canvas
  pointerNY: 0,
  hovering: false, // cursor is over the cup canvas (desktop hover, not drag)
  dragging: false,
  dragRotY: 0, // accumulated rotation (radians) from drag + idle auto-spin
  dragVelY: 0, // angular velocity, used for release inertia
};
