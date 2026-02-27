import { LoginClient } from "./login-client";

export default async function LoginPage({
    searchParams,
}: {
    // Use Promise to correctly type it for Next.js 15+ searchParams convention
    searchParams: Promise<{ message: string }>;
}) {
    const resolvedSearchParams = await searchParams;

    return <LoginClient message={resolvedSearchParams?.message} />;
}
