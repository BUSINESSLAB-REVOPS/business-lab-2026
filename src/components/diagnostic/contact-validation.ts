export function emailError(value: string): string {
  const email = value.trim();
  if (!email) return 'Escribe tu correo empresarial.';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
  const [local, domain] = email.split('@');
  if (
    local.length > 64 ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..') ||
    !validDomain(domain)
  )
    return 'Revisa el nombre y el dominio del correo, por ejemplo nombre@empresa.com.';
  return '';
}

function validDomain(domain: string): boolean {
  const labels = domain.split('.');
  return (
    domain.length <= 253 &&
    labels.length >= 2 &&
    labels.every((label) =>
      /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label),
    ) &&
    /^(?:[a-z]{2,63}|xn--[a-z\d-]+)$/i.test(labels.at(-1) ?? '')
  );
}

export function websiteResult(value: string): { value: string; error: string } {
  const raw = value.trim();
  const error = 'Escribe una web válida, por ejemplo https://tuempresa.com.';
  if (!raw)
    return { value: raw, error: 'Escribe la página web de tu empresa.' };
  if (/\s/.test(raw)) return { value: raw, error };
  const candidate =
    /^(?:[a-z][a-z\d+.-]*:\/\/|https?:|javascript:|data:|mailto:|ftp:|file:)/i.test(
      raw,
    )
      ? raw
      : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      !validDomain(url.hostname)
    )
      return { value: raw, error };
    return { value: url.href, error: '' };
  } catch {
    return { value: raw, error };
  }
}
