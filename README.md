# Veloce Digital Garage - Fuel & Vehicle Tracking Application

A modern, responsive web application for tracking your vehicles, logging fuel fill-ups, calculating efficiency, and predicting maintenance needs. Built with Next.js, Shadcn UI, Recharts, and Supabase.

## Tech Stack

*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts, Zustand.
*   **Backend/Database/Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth).
*   **AI/NLP**: Google Gemini (`@google/genai`) and `compromise.js` for zero-latency local parsing.
*   **Visuals**: [`vibe-particles`](https://www.npmjs.com/package/vibe-particles) - plugin-based Canvas 2D particle engine for interactive backgrounds.

## 🌟 Key Features

1. **Digital Garage Management**: Track an unlimited number of ICE, EV, and Motorcycle vehicles with a custom speedometer branding.
2. **Predictive Analytics**: Full Total Cost of Ownership (TCO) tracking using Recharts.
3. **Bring-Your-Own-Key AI**: Veloce Copilot uses AES-256-GCM encrypted database columns so users can safely provide their own Gemini Developer keys without exposing them.
4. **Zero-Latency NLP Parser**: Basic logging (e.g. "Filled up the Datsun for 1500") is routed through a local browser `compromise.js` NLP engine for $0 API cost and instant processing.
5. **Invoice OCR**: Use visual AI to extract totals, dates, and vendors directly from uploaded fuel and repair receipts.
6. **Secured Document Vault**: Store insurance and registration papers directly in Supabase Storage with strict RLS policies.
7. **Complete Data Control**: Edit or delete individual entries with a secure GitHub-style "type-to-confirm" guard for permanent deletions.
8. **Interactive UI**: Standardized `DD/MM/YYYY` formatting and a high-performance interactive particle background.

---

## 🚀 Setup Instructions

For a quick, beginner-friendly guide to deploying on Vercel, check out our [Vercel Deployment Guide](docs/vercel-deployment-guide.md).

### Step 1: Clone the Repository

If you haven't already, clone the repository to your local machine and install the dependencies:

```bash
git clone https://github.com/MattOfficial/veloce-digital-garage.git
cd veloce-digital-garage
npm install
```

### Step 2: Set up Supabase (Database & Auth)

1. **Create a Supabase Project**:
   * Go to [Supabase](https://supabase.com/) and create an account if you don't have one.
   * Click **"New Project"**, choose an organization, and give your project a name.
   * Set a secure database password and choose your region. Click **"Create new project"**.
   * Wait a minute or two for the database to provision.

2. **Get Supabase Environment Variables**:
   * In your Supabase dashboard, click the **Settings** gear icon (bottom left).
   * Go to **API** under Project Settings.
   * Copy the `Project URL` and the `Project API keys` (specifically the `anon` `public` key).

### Step 3: Google Cloud Setup (Authentication & Veloce Copilot)
To enable Google Sign-In and the AI Copilot, you need a Google Cloud project.

1. **Create a Google Cloud Project**:
   * Go to the [Google Cloud Console](https://console.cloud.google.com/).
   * Click the project dropdown near the top left and select **"New Project"**.
   * Name it and click **"Create"**. Make sure you select this new project.

2. **Configure OAuth Consent Screen (For Google Login)**:
   * Navigate to **APIs & Services** > **OAuth consent screen**.
   * Choose **External** and click **Create**.
   * Fill in the mandatory fields (App name, User support email, Developer contact info) and click **Save and Continue** until finished.

3. **Get Google OAuth Client ID & Secret**:
   * Go to **APIs & Services** > **Credentials**.
   * Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   * **Application type**: Web application. Name it whatever you like.
   * **Authorized redirect URIs**: You need to add your Supabase callback URL here.
     * *To find this*: Go to your **Supabase Dashboard** > **Authentication** > **Providers** > **Google**. There you will see a **Callback URL (for OAuth)**. It looks like `https://<your-project-id>.supabase.co/auth/v1/callback`.
     * Copy that from Supabase, paste it into Google Cloud as an Authorized redirect URI, and click **Create**.
   * A pop-up will show your **Client ID** and **Client Secret**. Keep this open.

4. **Connect Google Auth to Supabase**:
   * Go back to your **Supabase Dashboard** > **Authentication** > **Providers**.
   * Expand **Google** and toggle "Enable Sign in with Google".
   * Paste the **Client ID** and **Client Secret** you just got from Google Cloud.
   * Click **Save**.

6. **Get your Gemini API Key (Optional BYOK)**:
   * Users provide their own keys directly in the App UI. You do not need to hardcode a global key.

### Step 4: Configure Local Environment

1. In the root of your cloned repository, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Generate a secure random 32-byte hex string for encrypting user API keys:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Open `.env.local` in your code editor and paste the keys:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ENCRYPTION_MASTER_KEY=your_random_32_byte_hex_string
   ```

### Step 5: Run Database Migrations (Schema & Seed)

We need to create the required tables (`users`, `vehicles`, `fuel_logs`, `maintenance_logs`, etc.) and set up permissions.

1. **Install Supabase CLI** (If you haven't):
   * This is required to push the database schema directly to your project.
   * See [Supabase CLI Docs](https://supabase.com/docs/guides/cli) for installation instructions based on your OS.

2. **Link and Push Migrations**:
   * In your terminal, authenticate the CLI with your Supabase account:
     ```bash
     npx supabase login
     ```
   * Link your local project to your new Supabase project (you'll need your database password from Step 2):
     ```bash
     npx supabase link --project-ref <your-supabase-project-id>
     ```
     *(Your project ID is the random string in your Supabase project URL: `https://[PROJECT-ID].supabase.co`)*
   * Push the database schema:
     ```bash
     npx supabase db push
     ```

### Step 6: Run the Development Server

1. Start the Next.js development server:

```bash
npm run dev
```

2.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

*   `src/app`: Next.js App Router pages (Dashboard, Fuel Form, Maintenance, Insights).
*   `src/components`: UI components (Shadcn UI, Navbar, Sidebar, Particle Engine).
*   `src/store`: Zustand state management (`user-store.ts`, `vehicle-store.ts`).
*   `src/types`: Strict TypeScript definitions mapping to the Supabase schema.
*   `src/utils/supabase`: Supabase Client and Server connection utilities.
*   `supabase/`: SQL scripts for schema generation and initial seed data.

## 🔑 Authentication Note

Currently, the application is wired to read and write records associated with the logged-in user through Supabase RLS policies. To fully interact with the app, ensure you create a login flow or manually set the Supabase user session during development.
