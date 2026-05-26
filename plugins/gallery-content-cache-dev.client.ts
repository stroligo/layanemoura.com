/**
 * Dev: recarrega projetos quando o Studio grava YAML (HMR).
 * Sem bust no visibilitychange — evitava atraso ao atualizar a página.
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.dev || !import.meta.hot) return;

  import.meta.hot.on('vite:beforeUpdate', () => {
    clearNuxtData('content-projects');
  });

  import.meta.hot.on('vite:afterUpdate', () => {
    void refreshNuxtData('content-projects');
  });
});
