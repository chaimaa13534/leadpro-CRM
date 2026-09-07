import { ApiError } from '../utils/api-error.js';
import {
  createCompany,
  findById,
  listCities,
  listCompanies,
  listCountries,
  listIndustries,
  ownerExists,
  softDeleteCompany,
  updateCompany,
} from '../repositories/company.repository.js';
import type {
  CompanyListQuery,
  CompanyWithOwner,
  CreateCompanyInput,
  PaginatedResult,
  PublicCompany,
  UpdateCompanyInput,
} from '../types/company.types.js';

/** Maximum value allowed for the `limit` query parameter. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/** Allowed values for the `sort` query parameter. */
const ALLOWED_SORT_FIELDS: string[] = [
  'name',
  'industry',
  'city',
  'country',
  'created_at',
  'updated_at',
  'owner',
];

/**
 * Map a DB company (with owner & counts) to the public API shape. Never
 * exposes the internal owner_id or the raw joined columns.
 */
export function toPublicCompany(company: CompanyWithOwner): PublicCompany {
  return {
    id: company.id,
    name: company.name,
    industry: company.industry,
    website: company.website,
    phone: company.phone,
    email: company.email,
    address: company.address,
    city: company.city,
    country: company.country,
    description: company.notes,
    owner: {
      id: company.owner_id,
      firstName: company.owner_first_name,
      lastName: company.owner_last_name,
      email: company.owner_email,
      avatar: company.owner_avatar,
    },
    contactCount: company.contact_count,
    opportunityCount: company.opportunity_count,
    leadCount: company.lead_count,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
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
  industry?: string;
  country?: string;
  city?: string;
  ownerId?: string;
  sort?: string;
  order?: string;
}): CompanyListQuery {
  const parsedPage = Number.parseInt(query.page ?? '1', 10);
  const parsedLimit = Number.parseInt(
    query.limit ?? String(DEFAULT_LIMIT),
    10,
  );

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

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
    : 'name';

  return {
    page,
    limit,
    search: query.search?.trim() || undefined,
    industry: query.industry?.trim() || undefined,
    country: query.country?.trim() || undefined,
    city: query.city?.trim() || undefined,
    ownerId,
    sortBy,
    order,
  };
}

/**
 * List companies according to the query parameters, wrapped in a pagination
 * envelope. Only ever returns public company shapes.
 */
export async function getCompanies(query: {
  page?: string;
  limit?: string;
  search?: string;
  industry?: string;
  country?: string;
  city?: string;
  ownerId?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResult<PublicCompany>> {
  const normalized = normalizeListQuery(query);
  const { rows, total } = await listCompanies(normalized);

  const totalPages = Math.ceil(total / normalized.limit);

  return {
    items: rows.map(toPublicCompany),
    total,
    page: normalized.page,
    limit: normalized.limit,
    totalPages,
  };
}

/**
 * Get a single company's public shape by id.
 */
export async function getCompanyById(id: number): Promise<PublicCompany> {
  const company = await findById(id);
  if (!company) {
    throw ApiError.notFound('Company not found');
  }
  return toPublicCompany(company);
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
 * Create a new company and return its public shape.
 */
export async function createCompanyAccount(
  input: CreateCompanyInput,
): Promise<PublicCompany> {
  const ownerId = await resolveOwnerId(input.ownerId);

  const id = await createCompany({ ...input, ownerId });

  const created = await findById(id);
  if (!created) {
    throw ApiError.badRequest('Company created but could not be loaded');
  }

  return toPublicCompany(created);
}

/**
 * Update mutable fields of a company and return the updated public shape.
 */
export async function updateCompanyAccount(
  id: number,
  input: UpdateCompanyInput,
): Promise<PublicCompany> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Company not found');
  }

  let ownerId: number | undefined;
  if (input.ownerId !== undefined) {
    ownerId = await resolveOwnerId(input.ownerId);
  }

  await updateCompany(id, { ...input, ownerId });

  const updated = await findById(id);
  if (!updated) {
    throw ApiError.notFound('Company not found');
  }

  return toPublicCompany(updated);
}

/**
 * Soft-delete a company (sets `deleted_at`). Confirms it exists first.
 */
export async function deleteCompanyAccount(id: number): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Company not found');
  }

  await softDeleteCompany(id);
}

/**
 * Distinct filter values for the toolbar dropdowns.
 */
export async function getCompanyFilterOptions(): Promise<{
  industries: string[];
  cities: string[];
  countries: string[];
}> {
  const [industries, cities, countries] = await Promise.all([
    listIndustries(),
    listCities(),
    listCountries(),
  ]);

  return { industries, cities, countries };
}
