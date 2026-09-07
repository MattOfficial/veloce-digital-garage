import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AuthResult =
  | { user: User; error: null; supabase: Awaited<ReturnType<typeof createClient>> }
  | { user: null; error: string; supabase: Awaited<ReturnType<typeof createClient>> };

/**
 * Validates the current user session for server action mutations.
 * Returns either an authenticated user or a user-friendly error message.
 */
export async function getAuthenticatedUser(
  fallbackErrorMessage = "You must be logged in to perform this action.",
): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      error: fallbackErrorMessage,
      supabase,
    };
  }

  return {
    user,
    error: null,
    supabase,
  };
}
