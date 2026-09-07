const APP_VERSION = '0.1.0';
const CURRENT_YEAR = new Date().getFullYear();


export function Footer() {
  return (
    <footer className="shrink-0 border-t border-border px-6 py-4 tablet:px-8">
      <p className="text-caption text-text-secondary">
        LeadPro CRM · v{APP_VERSION} · © {CURRENT_YEAR}
      </p>
    </footer>
  );
}
