/** Divide a linha `aboutEmail` em texto + email (placeholder `{email}` ou endereço já substituído). */
export function aboutEmailParts(line: string, email: string) {
  const placeholder = '{email}';
  if (line.includes(placeholder)) {
    const index = line.indexOf(placeholder);
    return {
      before: line.slice(0, index),
      after: line.slice(index + placeholder.length),
    };
  }

  const index = line.indexOf(email);
  if (index >= 0) {
    return {
      before: line.slice(0, index),
      after: line.slice(index + email.length),
    };
  }

  return null;
}
