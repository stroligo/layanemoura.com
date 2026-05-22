/** Capas com prioridade alta (eager). Resto lazy. */
export const GALLERY_PRIORITY_COVER_COUNT = 4;

/** Máximo de preloads no `<head>` da home (cada um compete com o LCP). */
export const GALLERY_HEAD_PRELOAD_COUNT = 2;

/** Pré-carregamento em background após paint — só as primeiras capas. */
export const GALLERY_BACKGROUND_PRELOAD_COUNT = 4;

/** Cache longo para ficheiros estáticos versionados (segundos). */
export const STATIC_CACHE_MAX_AGE = 60 * 60 * 24 * 365;
