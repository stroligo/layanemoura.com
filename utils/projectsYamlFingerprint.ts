/** Hash do conteúdo dos YAML — muda ao editar no Studio (ex. published). */
export function projectsYamlFingerprint(): string {
  const modules = import.meta.glob('../content/projects/*.{yml,yaml}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, raw]) => `${path}\n${raw}`)
    .join('\n---\n');
}
