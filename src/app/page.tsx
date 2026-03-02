import { LandingPage } from "@/components/landing-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If the user happens to have an active session, forward them seamlessly to the dashboard.
    // Otherwise, show the beautiful landing page.
    if (user) {
        redirect("/dashboard");
    }

    return <LandingPage />;
}
