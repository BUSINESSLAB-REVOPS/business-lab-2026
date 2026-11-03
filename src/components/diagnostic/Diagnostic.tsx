import { useEffect, useMemo, useRef, useState } from 'react';
import intlTelInput from 'intl-tel-input';
import { es } from 'intl-tel-input/locale';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { emailError, websiteResult } from './contact-validation';
import { track } from './metrics';
import { cn } from '@/lib/utils';
import { questions } from './questions';

interface Props {
  dialogId: string;
  initialTrigger: HTMLElement;
}
export interface DiagnosticOpenDetail {
  dialogId: string;
  trigger: HTMLElement;
}
declare global {
  interface DocumentEventMap {
    'business-lab:diagnostic-open': CustomEvent<DiagnosticOpenDetail>;
  }
}

const DEFAULT_BOOKINGS_URL =
  import.meta.env.PUBLIC_ZOHO_BOOKINGS_URL ||
  'https://revops1.zohobookings.com/portal-embed#/5013442000000038009';

export function formatZohoBookingsUrl(
  rawUrl: string,
  values: Record<string, string>,
): { embedUrl: string; directUrl: string } {
  const url = (rawUrl || DEFAULT_BOOKINGS_URL).trim();

  let serviceId = '5013442000000038009';
  const idMatch = url.match(
    /zohobookings\.com(?:\/portal-embed#|\/#|\/customer)?\/([0-9a-zA-Z_-]+)/,
  );
  if (idMatch && idMatch[1]) {
    serviceId = idMatch[1];
  }

  let origin = 'https://revops1.zohobookings.com';
  try {
    if (url.startsWith('http')) {
      origin = new URL(url).origin;
    }
  } catch {
    // fallback
  }

  const baseEmbedUrl = `${origin}/portal-embed#/${serviceId}`;
  const directUrl = `${origin}/${serviceId}`;

  const queryParams = new URLSearchParams();
  if (values.fullName) {
    queryParams.set('Name', values.fullName);
    queryParams.set('name', values.fullName);
  }
  if (values.email) {
    queryParams.set('Email', values.email);
    queryParams.set('email', values.email);
  }
  if (values.phone) {
    queryParams.set('Phone', values.phone);
    queryParams.set('phone', values.phone);
    queryParams.set('phone_number', values.phone);
    queryParams.set('Contact Number', values.phone);
  }
  if (values.company) {
    queryParams.set('Company', values.company);
    queryParams.set('company', values.company);
  }

  const qs = queryParams.toString();
  const embedUrl = qs ? `${baseEmbedUrl}?${qs}` : baseEmbedUrl;
  const fullDirectUrl = qs ? `${directUrl}?${qs}` : directUrl;

  return { embedUrl, directUrl: fullDirectUrl };
}

const fields = [
  {
    name: 'fullName',
    label: 'Nombre completo',
    autoComplete: 'name',
    maxLength: 120,
  },
  {
    name: 'company',
    label: 'Nombre de la empresa',
    autoComplete: 'organization',
    maxLength: 160,
  },
  {
    name: 'website',
    label: 'Sitio web de la empresa',
    autoComplete: 'url',
    type: 'url',
    maxLength: 300,
    extended: true,
  },
  {
    name: 'email',
    label: 'Correo empresarial',
    autoComplete: 'email',
    type: 'email',
    maxLength: 254,
  },
] as const;

export default function Diagnostic({ dialogId, initialTrigger }: Props) {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneStatus, setPhoneStatus] = useState('loading');
  const panel = useRef<HTMLDivElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);
  const phone = useRef<ReturnType<typeof intlTelInput> | null>(null);
  const opener = useRef<HTMLElement | null>(initialTrigger);
  const tracked = useRef(false);

  const bookingsUrls = useMemo(
    () => formatZohoBookingsUrl(DEFAULT_BOOKINGS_URL, values),
    [values],
  );

  const visibleFields = fields;
  useEffect(() => {
    const onOpen = (event: CustomEvent<DiagnosticOpenDetail>) => {
      if (event.detail.dialogId !== dialogId) return;
      opener.current = event.detail.trigger;
      tracked.current = false;
      setOpen(true);
    };
    document.addEventListener('business-lab:diagnostic-open', onOpen);
    return () => {
      document.removeEventListener('business-lab:diagnostic-open', onOpen);
    };
  }, [dialogId]);

  // Radix mounts portal contents after opening; initialize only once the input exists.
  useEffect(() => {
    if (!open) return;
    let instance: ReturnType<typeof intlTelInput> | null = null;
    let cancelled = false;
    const timer = requestAnimationFrame(() => {
      if (!phoneInput.current || !panel.current) return;
      setPhoneStatus('loading');
      instance = intlTelInput(phoneInput.current, {
        initialCountry: 'pe',
        separateDialCode: true,
        countrySearch: true,
        countryNameLocale: 'es',
        uiTranslations: es,
        countrySelectorMode: intlTelInput.COUNTRY_SELECTOR_MODE.AUTO,
        dropdownParent: panel.current,
        fullscreenParent: panel.current,
        countryOrder: ['pe', 'es', 'mx', 'co', 'ec', 'cl', 'ar', 'us'],
        loadUtils: () => import('intl-tel-input/utils'),
      });
      phone.current = instance;
      instance.promise
        .then(() => {
          if (!cancelled) {
            if (values.phone) instance?.setNumber(values.phone);
            setPhoneStatus('ready');
          }
        })
        .catch(() => {
          if (!cancelled) setPhoneStatus('failed');
        });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(timer);
      instance?.destroy();
      phone.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (open)
      panel.current
        ?.querySelector<HTMLElement>('[data-step]:not([hidden]) h3')
        ?.focus();
  }, [step]);

  const update = (name: string, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  function validate(control: HTMLInputElement | HTMLTextAreaElement) {
    control.setCustomValidity('');
    let message = '';
    const raw = control.value.trim();
    if (control.name === 'email') message = emailError(raw);
    else if (control.name === 'website') {
      const result = websiteResult(raw);
      message = result.error;
      if (!message) {
        control.value = result.value;
        update('website', result.value);
      }
    } else if (control.name === 'phone')
      message = !raw
        ? 'Escribe tu número de teléfono.'
        : phoneStatus !== 'ready'
          ? phoneStatus === 'failed'
            ? 'No se pudo cargar la validación del teléfono. Recarga la página e inténtalo de nuevo.'
            : 'La validación del teléfono está cargando. Inténtalo de nuevo en un momento.'
          : !phone.current?.isValidNumber()
            ? 'Revisa el número: su longitud debe corresponder al país seleccionado.'
            : '';
    else if (control.required && !raw) message = 'Completa este campo.';
    else if (['fullName', 'company'].includes(control.name) && raw.length < 2)
      message = 'Escribe al menos dos caracteres.';
    else if (!control.validity.valid)
      message = 'Revisa el formato y los límites de este campo.';
    control.setCustomValidity(message);
    setErrors((previous) => ({ ...previous, [control.name]: message }));
    return message;
  }

  function next(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0) {
      const missing = questions.find(([name]) => !values[name]);
      if (missing) {
        setErrors({ [missing[0]]: 'Selecciona una respuesta.' });
        panel.current
          ?.querySelector<HTMLElement>(
            `[data-question="${missing[0]}"] [role="radio"]`,
          )
          ?.focus();
        return;
      }
    }
    if (step > 0) {
      const controls = Array.from(
        event.currentTarget.querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement
        >(
          `[data-step="${step}"] input:not([type="hidden"]):not([type="radio"]), [data-step="${step}"] textarea`,
        ),
      );
      let first: HTMLInputElement | HTMLTextAreaElement | undefined;
      for (const control of controls)
        if (validate(control) && !first) first = control;
      if (first) {
        first.focus();
        return;
      }
      if (step === 1) {
        setValues((previous) => ({
          ...previous,
          phone: phone.current?.getNumber() || previous.phone,
        }));
        if (!tracked.current) {
          tracked.current = true;
          track('diagnostic_form_submit', { mode: 'zoho_bookings' });
        }
      }
    }
    setErrors({});
    if (step < 2) setStep(step + 1);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={panel}
        id={dialogId}
        showCloseButton={false}
        className={cn(
          'max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden text-foreground bg-background transition-all duration-200 shadow-xl',
          step === 2 ? 'sm:max-w-3xl' : 'sm:max-w-2xl',
        )}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          opener.current?.focus({ preventScroll: true });
        }}
      >
        {/* Encabezado fijo */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-border/60 bg-background space-y-3">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="font-display text-2xl text-foreground">
              Tu diagnóstico comercial
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Cerrar formulario"
                className="text-muted-foreground hover:text-foreground"
              >
                Cerrar
              </Button>
            </DialogClose>
          </div>

          <DialogDescription className="sr-only">
            Diagnóstico comercial
          </DialogDescription>

          <div className="space-y-1.5">
            <p
              aria-live="polite"
              className="m-0 text-xs font-medium text-muted-foreground"
            >
              Paso {step + 1} de 3
            </p>
            <Progress
              value={((step + 1) / 3) * 100}
              aria-label="Progreso del diagnóstico"
            />
          </div>
        </div>

        {/* Formulario con cuerpo scrolleable y footer fijo */}
        <form
          noValidate
          onSubmit={next}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          {/* Cuerpo Central Scrolleable */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 custom-dialog-scroll">
            {/* Paso 0: Preguntas de diagnóstico */}
            <div data-step="0" hidden={step !== 0}>
              <h3
                tabIndex={-1}
                className="text-xl font-semibold text-foreground mb-6"
              >
                Sobre tu empresa
              </h3>
              {questions.map(([name, title, options], qIdx) => (
                <fieldset
                  key={name}
                  data-question={name}
                  className={cn(
                    'min-w-0 border-0 p-0',
                    qIdx > 0 ? 'mt-8' : 'mt-0',
                  )}
                >
                  <legend className="block w-full pb-3 text-base font-semibold text-foreground">
                    {title}{' '}
                    <span className="text-red-500 font-bold" aria-hidden="true">
                      *
                    </span>
                  </legend>
                  <RadioGroup
                    name={name}
                    value={values[name] || ''}
                    onValueChange={(value) => update(name, value)}
                    aria-label={title}
                    aria-required="true"
                    aria-describedby={
                      errors[name] ? `${dialogId}-${name}-error` : undefined
                    }
                  >
                    {options.map((option, index) => (
                      <Label
                        key={option}
                        htmlFor={`${dialogId}-${name}-${index}`}
                        className="flex min-h-12 cursor-pointer justify-between rounded-md border border-input px-3 py-2 text-sm"
                      >
                        <span>{option}</span>
                        <RadioGroupItem
                          id={`${dialogId}-${name}-${index}`}
                          value={option}
                        />
                      </Label>
                    ))}
                  </RadioGroup>
                  {errors[name] && (
                    <p
                      id={`${dialogId}-${name}-error`}
                      role="alert"
                      className="text-destructive text-sm mt-1"
                    >
                      {errors[name]}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>

            {/* Paso 1: Información de contacto */}
            <div data-step="1" hidden={step !== 1} className="space-y-4">
              <div>
                <h3
                  tabIndex={-1}
                  className="text-xl font-semibold text-foreground"
                >
                  Información de contacto
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Completa tus datos y los de tu equipo para preparar el
                  diagnóstico.
                </p>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {visibleFields.map(({ name, label, ...props }) => (
                  <div key={name} className="grid content-start gap-1.5">
                    <Label
                      htmlFor={`${dialogId}-${name}`}
                      className="text-sm font-medium"
                    >
                      {label}
                    </Label>
                    <Input
                      {...Object.fromEntries(
                        Object.entries(props).filter(
                          ([key]) => key !== 'extended',
                        ),
                      )}
                      id={`${dialogId}-${name}`}
                      name={name}
                      value={values[name] || ''}
                      required
                      placeholder={
                        name === 'website' ? 'https://tuempresa.com' : undefined
                      }
                      onChange={(event) => update(name, event.target.value)}
                      onBlur={(event) => validate(event.target)}
                      aria-invalid={!!errors[name]}
                      aria-describedby={
                        errors[name] ? `${dialogId}-${name}-error` : undefined
                      }
                    />
                    {errors[name] && (
                      <span
                        id={`${dialogId}-${name}-error`}
                        className="text-xs text-destructive mt-0.5"
                      >
                        {errors[name]}
                      </span>
                    )}
                  </div>
                ))}
                <div className="grid content-start gap-1.5 [&_.iti]:w-full [&_.iti\_\_selected-dial-code]:!text-sm [&_.iti\_\_selected-dial-code]:!font-normal [&_.iti\_\_selected-dial-code]:!leading-5 [&_.iti\_\_selected-dial-code]:text-foreground [&_input]:!text-sm [&_input]:!font-normal">
                  <Label
                    htmlFor={`${dialogId}-phone`}
                    className="text-sm font-medium"
                  >
                    Número de teléfono
                  </Label>
                  <Input
                    ref={phoneInput}
                    id={`${dialogId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    defaultValue={values.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? `${dialogId}-phone-error` : undefined
                    }
                  />
                  {errors.phone && (
                    <span
                      id={`${dialogId}-phone-error`}
                      className="text-xs text-destructive mt-0.5"
                    >
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Paso 2: Zoho Bookings (Fecha y hora sincronizada en tiempo real) */}
            <div data-step="2" hidden={step !== 2} className="space-y-4">
              <div>
                <h3
                  tabIndex={-1}
                  className="text-xl font-semibold text-foreground"
                >
                  Elige fecha y hora
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Diagnóstico comercial · 30 minutos. Selecciona el día y la
                  hora que mejor te acomode en nuestra agenda en tiempo real.
                </p>
              </div>

              {/* Ficha rápida de contacto */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs sm:text-sm">
                <div className="text-foreground">
                  <span className="font-semibold">
                    {values.fullName || 'Tus datos'}
                  </span>
                  {values.company && <span> · {values.company}</span>}
                  {values.email && (
                    <span className="text-muted-foreground">
                      {' '}
                      ({values.email})
                    </span>
                  )}
                  {values.phone && (
                    <span className="text-muted-foreground">
                      {' '}
                      · {values.phone}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="h-7 text-xs font-medium text-primary hover:text-primary-hover"
                >
                  Editar datos
                </Button>
              </div>

              {/* Iframe Zoho Bookings */}
              <div className="relative min-h-[580px] sm:min-h-[640px] w-full overflow-hidden rounded-lg border border-border bg-background shadow-xs">
                {step === 2 && (
                  <iframe
                    src={bookingsUrls.embedUrl}
                    title="Agendar cita en Zoho Bookings"
                    className="h-[580px] sm:h-[640px] w-full border-0"
                    allow="camera; microphone"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Enlace alternativo directo */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  Los horarios ocupados se bloquean automáticamente en nuestra
                  agenda.
                </span>
                <a
                  href={bookingsUrls.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Abrir en pestaña nueva ↗
                </a>
              </div>
            </div>
          </div>

          {/* Footer Fijo */}
          <div className="shrink-0 px-6 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setErrors({});
                  setStep(step - 1);
                }}
              >
                Volver
              </Button>
            ) : (
              <div />
            )}
            {step < 2 ? (
              <Button type="submit" className="ml-auto">
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                className="ml-auto"
                onClick={() => {
                  setOpen(false);
                  setValues({});
                  setStep(0);
                  tracked.current = false;
                }}
              >
                Finalizar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
