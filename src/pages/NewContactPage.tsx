import { ContactHeader } from '@/features/contacts/components/ContactHeader';
import { ContactForm } from '@/features/contacts/components/ContactForm';

/**
 * Page "Nouveau Contact" — utilise `MainLayout` (via le routeur).
 * Accessible depuis le module Contacts.
 */
export function NewContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <ContactHeader />
      <div className="mx-auto w-full max-w-3xl">
        <ContactForm />
      </div>
    </div>
  );
}

