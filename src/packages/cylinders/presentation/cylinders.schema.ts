import { z } from 'zod';

/** Maximum accepted length of the cylinder search keyword. */
export const CYLINDER_SEARCH_MAX_LENGTH = 100;

/** Search filter for the cylinder list (table). */
export const cylindersFilterSchema = z.object({
  search: z
    .string()
    .trim()
    .max(CYLINDER_SEARCH_MAX_LENGTH, `Kata kunci maksimal ${CYLINDER_SEARCH_MAX_LENGTH} karakter.`),
});

export type CylindersFilter = z.infer<typeof cylindersFilterSchema>;

/**
 * Validates a raw filter input. When the input is not valid (e.g. over the
 * length limit) it degrades gracefully to a trimmed, length-capped keyword
 * instead of wiping the user's query.
 */
export function parseCylindersFilter(input: Partial<CylindersFilter>): CylindersFilter {
  const result = cylindersFilterSchema.safeParse(input);
  if (result.success) return result.data;
  return { search: (input.search ?? '').trim().slice(0, CYLINDER_SEARCH_MAX_LENGTH) };
}

