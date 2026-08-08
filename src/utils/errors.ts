/**
 * Postgres and PostgREST codes that both mean "the table does not have the
 * column the code is writing to" — in practice, a migration that was never
 * applied to this database.
 *
 * 42703 is Postgres rejecting the statement; PGRST204 is PostgREST rejecting it
 * earlier, from its cached schema. Either way the fix is the same, and it is a
 * deployment problem rather than anything the user did wrong.
 */
const MISSING_COLUMN_CODES = new Set(["42703", "PGRST204"]);

type DatabaseError = { message?: string; code?: string; details?: string | null };

/**
 * Turns a database error into something worth showing.
 *
 * A generic "failed to save" strands the real cause in a server log, which is
 * how a pending migration ends up looking like a mysterious app bug. The
 * message goes to the UI; only the code is interpreted.
 */
export function getDatabaseErrorMessage(
    error: DatabaseError | null | undefined,
    fallback: string,
): string {
    if (!error) return fallback;

    if (error.code != null && MISSING_COLUMN_CODES.has(error.code)) {
        return `The database is missing a column this version of the app writes to (${error.message ?? "unknown column"}). A migration is pending — run "bunx supabase db push".`;
    }

    return error.message ? `${fallback}: ${error.message}` : fallback;
}

export function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    ) {
        return (error as { message: string }).message;
    }

    return fallback;
}
