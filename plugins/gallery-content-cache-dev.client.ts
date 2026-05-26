/**
 * Dev: invalida a lista de projetos quando o Studio grava YAML ou o Vite faz HMR.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) return;

  const bust = () => {
    clearNuxtData('content-projects');
    return refreshNuxtData('content-projects');
  };

  nuxtApp.hook('app:mounted', () => {
    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeUpdate', () => {
        clearNuxtData('content-projects');
      });
      import.meta.hot.on('vite:afterUpdate', () => {
        void bust();
      });
    }
  });

  // Studio grava ficheiros fora do HMR do iframe — ao voltar à home, recarrega.
  if (import.meta.client) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void bust();
      }
    });
  }
});
