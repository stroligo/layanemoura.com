const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableElements(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.tabIndex !== -1,
  );
}

export function useFocusTrap(
  containerRef: Ref<HTMLElement | null | undefined>,
  options: {
    active: Ref<boolean>;
    onEscape?: () => void;
  },
) {
  let previouslyFocused: HTMLElement | null = null;

  function trapKeydown(event: KeyboardEvent) {
    if (!options.active.value || !containerRef.value) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      options.onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const nodes = focusableElements(containerRef.value);
    if (!nodes.length) return;

    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(
    () => options.active.value,
    async (isActive) => {
      if (!import.meta.client) return;

      if (isActive) {
        previouslyFocused = document.activeElement as HTMLElement | null;
        document.addEventListener('keydown', trapKeydown);
        await nextTick();
        const root = containerRef.value;
        if (!root) return;
        const nodes = focusableElements(root);
        (nodes[0] ?? root).focus();
        return;
      }

      document.removeEventListener('keydown', trapKeydown);
      previouslyFocused?.focus?.();
      previouslyFocused = null;
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (import.meta.client) {
      document.removeEventListener('keydown', trapKeydown);
    }
  });
}
