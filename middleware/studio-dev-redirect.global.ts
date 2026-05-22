/** Em dev o Studio abre pelo botão flutuante; evita /_studio sem OAuth local. */
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/_studio')) return;

  const config = useRuntimeConfig();
  if (config.public.studioDev) {
    return navigateTo('/', { replace: true });
  }
});
