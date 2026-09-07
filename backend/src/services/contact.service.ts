import { ApiError } from '../utils/api-error.js';
import { createNotification } from './notification.service.js';
import {
  companyExists,
  createContact,
  findById,
  listContacts,
  ownerExists,
  softDeleteContact,
  updateContact,
} from '../repositories/contact.repository.js';
import type {
  ContactListQuery,
  ContactWithRelations,
  CreateContactInput,
  PaginatedResult,
  PublicContact,
  UpdateContactInput,
} from '../types/contact.types.js';

/** Maximum value allowed for the `limit` query parameter. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/** Allowed values for the `sort` query parameter. */
const ALLOWED_SORT_FIELDS: string[] = [
  'first_name',
  'last_name',
  'email',
  'position',
  'company',
  'owner',
  'created_at',
  'updated_at',
];

/**
 * Map a DB contact (with company and owner) to the public API shape. Never
 * exposes the internal company_id / owner_id or the raw joined columns.
 */
export function toPublicContact(contact: ContactWithRelations): PublicContact {
  return {
    id: contact.id,
    firstName: contact.first_name,
    lastName: contact.last_name,
    email: contact.email,
    phone: contact.phone,
    position: contact.position,
    company: {
      id: contact.company_id,
      name: contact.company_name,
    },
    owner: {
      id: contact.owner_id,
      firstName: contact.owner_first_name,
      lastName: contact.owner_last_name,
      email: contact.owner_email,
      avatar: contact.owner_avatar,
    },
    notes: contact.notes,
    createdAt: contact.created_at,
    updatedAt: contact.updated_at,
  };
}

/**
 * Normalize and validate the incoming list query. Applies safe defaults and
 * clamps page/limit so the repository always receives valid values.
 */
function normalizeListQuery(query: {
  page?: string;
  limit?: string;
  search?: string;
  companyId?: string;
  ownerId?: string;
  sort?: string;
  order?: string;
}): ContactListQuery {
  const parsedPage = Number.parseInt(query.page ?? '1', 10);
  const parsedLimit = Number.parseInt(query.limit ?? String(DEFAULT_LIMIT), 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  let companyId: number | undefined;
  if (query.companyId !== undefined && query.companyId !== '') {
    const parsedCompany = Number.parseInt(query.companyId, 10);
    if (Number.isInteger(parsedCompany) && parsedCompany > 0) {
      companyId = parsedCompany;
    }
  }

  let ownerId: number | undefined;
  if (query.ownerId !== undefined && query.ownerId !== '') {
    const parsedOwner = Number.parseInt(query.ownerId, 10);
    if (Number.isInteger(parsedOwner) && parsedOwner > 0) {
      ownerId = parsedOwner;
    }
  }

  const order = query.order === 'asc' ? 'asc' : 'desc';
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sort ?? '')
    ? (query.sort as string)
    : 'first_name';

  return {
    page,
    limit,
    search: query.search?.trim() || undefined,
    companyId,
    ownerId,
    sortBy,
    order,
  };
}

/**
 * List contacts according to the query parameters, wrapped in a pagination
 * envelope. Only ever returns public contact shapes.
 */
export async function getContacts(query: {
  page?: string;
  limit?: string;
  search?: string;
  companyId?: string;
  ownerId?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResult<PublicContact>> {
  const normalized = normalizeListQuery(query);
  const { rows, total } = await listContacts(normalized);

  const totalPages = Math.ceil(total / normalized.limit);

  return {
    items: rows.map(toPublicContact),
    total,
    page: normalized.page,
    limit: normalized.limit,
    totalPages,
  };
}

/**
 * Get a single contact's public shape by id.
 */
export async function getContactById(id: number): Promise<PublicContact> {
  const contact = await findById(id);
  if (!contact) {
    throw ApiError.notFound('Contact not found');
  }
  return toPublicContact(contact);
}

/**
 * Validate that a company id exists and throw a 400 otherwise.
 */
async function resolveCompanyId(companyId: number): Promise<number> {
  const exists = await companyExists(companyId);
  if (!exists) {
    throw ApiError.badRequest('The provided company does not exist');
  }
  return companyId;
}

/**
 * Validate that an owner (user) id exists and throw a 400 otherwise.
 */
async function resolveOwnerId(ownerId: number): Promise<number> {
  const exists = await ownerExists(ownerId);
  if (!exists) {
    throw ApiError.badRequest('The provided owner does not exist');
  }
  return ownerId;
}

/**
 * Create a new contact and return its public shape.
 */
export async function createContactAccount(
  input: CreateContactInput,
): Promise<PublicContact> {
  const companyId = await resolveCompanyId(input.companyId);
  const ownerId = await resolveOwnerId(input.ownerId);

  const id = await createContact({ ...input, companyId, ownerId });

  const created = await findById(id);
  if (!created) {
    throw ApiError.badRequest('Contact created but could not be loaded');
  }

  const contact = toPublicContact(created);
  try {
    await createNotification(ownerId, {
      type: 'CONTACT_CREATED',
      title: 'Nouveau contact créé',
      message: `Le contact ${contact.firstName} ${contact.lastName} a été créé.`,
      entityType: 'contact',
      entityId: contact.id,
    });
  } catch {
    console.error('Notification creation failed', { event: 'contact_created', contactId: contact.id });
  }
  return contact;
}

/**
 * Update mutable fields of a contact and return the updated public shape.
 */
export async function updateContactAccount(
  id: number,
  input: UpdateContactInput,
): Promise<PublicContact> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Contact not found');
  }

  let companyId: number | undefined;
  if (input.companyId !== undefined) {
    companyId = await resolveCompanyId(input.companyId);
  }

  let ownerId: number | undefined;
  if (input.ownerId !== undefined) {
    ownerId = await resolveOwnerId(input.ownerId);
  }

  await updateContact(id, { ...input, companyId, ownerId });

  const updated = await findById(id);
  if (!updated) {
    throw ApiError.notFound('Contact not found');
  }

  return toPublicContact(updated);
}

/**
 * Soft-delete a contact (sets `deleted_at`). Confirms it exists first.
 */
export async function deleteContactAccount(id: number): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Contact not found');
  }

  await softDeleteContact(id);
}
