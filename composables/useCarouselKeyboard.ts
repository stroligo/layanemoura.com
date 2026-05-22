import { useDialogLock } from '~/composables/useDialogLock';

/** Setas ← → só quando o foco está dentro do contentor do carrossel e sem modal aberto. */
export function useCarouselKeyboard(
  rootRef: Ref<HTMLElement | null | undefined>,
  handlers: { onPrev: () => void; onNext: () => void },
) {
  const { dialogOpen } = useDialogLock();

  function onKeydown(event: KeyboardEvent) {
    if (dialogOpen.value) return;
    const root = rootRef.value;
    if (!root?.contains(document.activeElement)) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlers.onPrev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handlers.onNext();
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown);
  });
}
