/** Bloqueia atalhos globais (ex.: carrossel de reviews) quando um dialog está aberto. */
const dialogOpen = ref(false);

export function useDialogLock() {
  function setDialogOpen(open: boolean) {
    dialogOpen.value = open;
  }

  return {
    dialogOpen: readonly(dialogOpen),
    setDialogOpen,
  };
}
