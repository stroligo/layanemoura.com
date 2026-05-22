<template>
  <svg
    class="site-logo-svg"
    :class="{
      'site-logo-svg--ready': ready,
      'site-logo-svg--inverted': inverted,
    }"
    :viewBox="LOGO_SIGNATURE_VIEWBOX"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <clipPath :id="clipId" clipPathUnits="userSpaceOnUse">
        <rect
          ref="clipRectEl"
          x="0"
          y="0"
          :width="LOGO_SIGNATURE_WIDTH"
          :height="LOGO_SIGNATURE_HEIGHT"
          class="site-logo-svg__clip-rect"
        />
      </clipPath>
    </defs>
    <g :clip-path="`url(#${clipId})`">
      <path class="site-logo-svg__path" :d="LOGO_SIGNATURE_PATH_D" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import {
  LOGO_SIGNATURE_HEIGHT,
  LOGO_SIGNATURE_PATH_D,
  LOGO_SIGNATURE_VIEWBOX,
  LOGO_SIGNATURE_WIDTH,
} from '~/constants/logoSignaturePath';

const DRAW_MS = 4800;
const HOLD_MS = 4200;
const RESET_MS = 700;

const props = withDefaults(
  defineProps<{
    animate?: boolean;
    inverted?: boolean;
  }>(),
  {
    animate: true,
    inverted: false,
  },
);

const clipId = useId().replace(/:/g, '');
const clipRectEl = ref<SVGRectElement | null>(null);
const ready = ref(false);
const phase = ref<'draw' | 'hold' | 'idle'>('idle');

let stopped = false;
let holdTimer: ReturnType<typeof window.setTimeout> | undefined;
let resetTimer: ReturnType<typeof window.setTimeout> | undefined;
let drawTimer: ReturnType<typeof window.setTimeout> | undefined;

function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setReveal(scale: number, animate: boolean) {
  const rect = clipRectEl.value;
  if (!rect) return;
  rect.style.transition = animate
    ? `transform ${DRAW_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`
    : `transform ${RESET_MS}ms cubic-bezier(0.4, 0, 0.6, 1)`;
  rect.style.transform = `scaleX(${scale})`;
  rect.style.transformOrigin = '0 50%';
  rect.style.transformBox = 'fill-box';
}

function clearTimers() {
  if (drawTimer) window.clearTimeout(drawTimer);
  if (holdTimer) window.clearTimeout(holdTimer);
  if (resetTimer) window.clearTimeout(resetTimer);
  drawTimer = holdTimer = resetTimer = undefined;
}

async function runCycle() {
  if (stopped || !props.animate) return;

  phase.value = 'draw';
  setReveal(0, false);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReveal(1, true);
        resolve();
      });
    });
  });

  drawTimer = window.setTimeout(() => {
    if (stopped) return;
    phase.value = 'hold';
    setReveal(1, false);

    holdTimer = window.setTimeout(() => {
      if (stopped) return;
      ready.value = false;
      phase.value = 'idle';
      setReveal(0, false);

      resetTimer = window.setTimeout(() => {
        if (stopped) return;
        ready.value = true;
        runCycle();
      }, RESET_MS);
    }, HOLD_MS);
  }, DRAW_MS);
}

onMounted(() => {
  const rect = clipRectEl.value;
  if (!rect) return;

  rect.style.transform = 'scaleX(1)';
  rect.style.transformOrigin = '0 50%';
  rect.style.transformBox = 'fill-box';

  ready.value = true;

  const skipAnimation = !props.animate || prefersReducedMotion();

  if (skipAnimation) {
    phase.value = 'hold';
    setReveal(1, false);
    return;
  }

  setReveal(0, false);
  runCycle();
});

onUnmounted(() => {
  stopped = true;
  clearTimers();
});
</script>
