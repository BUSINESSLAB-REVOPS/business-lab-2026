type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// Cola local sin proveedor ni solicitudes de red. No incluir valores de formularios.
export function track(event: string, data: EventData = {}) {
  const payload = { event, site: 'business-lab', ...data };
  (window.dataLayer ??= []).push(payload);
  window.dispatchEvent(
    new CustomEvent('business-lab:analytics', { detail: payload }),
  );
}
