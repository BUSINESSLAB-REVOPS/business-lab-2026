import { createRoot, type Root } from 'react-dom/client';
import Diagnostic from './Diagnostic';
import phoneStyles from 'intl-tel-input/styles?inline';
import diagnosticStyles from '../../styles/diagnostic.css?inline';

let root: Root | undefined;

export function openDiagnostic(trigger: HTMLElement) {
  const dialogId = 'business-lab-diagnostic';
  if (!root) {
    // Inline CSS imports stay in this lazy chunk; Astro otherwise hoists even
    // dynamically imported component styles into every page's head.
    const styles = document.createElement('style');
    styles.textContent = `${phoneStyles}\n${diagnosticStyles}`;
    document.head.appendChild(styles);
    root = createRoot(document.getElementById('consultation-root')!);
    root.render(<Diagnostic dialogId={dialogId} initialTrigger={trigger} />);
    return;
  }
  document.dispatchEvent(
    new CustomEvent('business-lab:diagnostic-open', {
      detail: { dialogId, trigger },
    }),
  );
}
