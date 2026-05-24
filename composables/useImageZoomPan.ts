const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.4;

export function useImageZoomPan() {
  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);

  const transformStyle = computed(() => ({
    transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})`,
  }));

  const canPan = computed(() => scale.value > 1);

  function resetView() {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  }

  function zoomIn() {
    scale.value = Math.min(MAX_SCALE, Number((scale.value + ZOOM_STEP).toFixed(2)));
  }

  function zoomOut() {
    const next = Math.max(MIN_SCALE, Number((scale.value - ZOOM_STEP).toFixed(2)));
    scale.value = next;
    if (next <= MIN_SCALE) {
      translateX.value = 0;
      translateY.value = 0;
    }
  }

  function applyWheelZoom(deltaY: number) {
    if (deltaY < 0) zoomIn();
    else if (deltaY > 0) zoomOut();
  }

  let dragging = false;
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  function onPointerDown(event: PointerEvent) {
    if (!canPan.value || event.button !== 0) return;

    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    originX = translateX.value;
    originY = translateY.value;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging || pointerId !== event.pointerId) return;

    translateX.value = originX + (event.clientX - startX);
    translateY.value = originY + (event.clientY - startY);
  }

  function onPointerUp(event: PointerEvent) {
    if (pointerId !== event.pointerId) return;

    dragging = false;
    pointerId = null;

    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }

  return {
    scale,
    translateX,
    translateY,
    canPan,
    transformStyle,
    resetView,
    zoomIn,
    zoomOut,
    applyWheelZoom,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
