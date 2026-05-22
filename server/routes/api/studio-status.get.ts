/** Diagnóstico rápido do Studio em produção (não expõe segredos). */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);

  const hasGithubId = Boolean(config.studioGithubClientId);
  const hasGithubSecret = Boolean(config.studioGithubClientSecret);

  return {
    studioInBuild: config.public.studioInBuild,
    studioDevMode: config.public.studioDev,
    githubOAuthConfigured: hasGithubId && hasGithubSecret,
    githubClientIdSet: hasGithubId,
    siteUrl: config.public.siteUrl,
    studioUrl: `${config.public.siteUrl}/_studio`,
    oauthCallbackHint: `${config.public.siteUrl}/_studio/auth/github/callback`,
    nextSteps: config.public.studioInBuild
      ? hasGithubId && hasGithubSecret
        ? 'Abra /_studio e inicie sessão com GitHub. Confirme o callback no OAuth App.'
        : 'Defina STUDIO_GITHUB_CLIENT_ID e STUDIO_GITHUB_CLIENT_SECRET no servidor e reinicie.'
      : 'Defina STUDIO_REPOSITORY_OWNER e STUDIO_REPOSITORY_REPO, faça npm run build de novo e reinicie.',
  };
});
