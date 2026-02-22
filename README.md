# Digital Garage - Fuel & Vehicle Tracking Application

A modern, responsive web application for tracking your vehicles, logging fuel fill-ups, calculating efficiency, and predicting maintenance needs. Built with Next.js, Shadcn UI, Recharts, and Supabase.

## Tech Stack

*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts, Zustand.
*   **Backend/Database/Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth).

---

## 🚀 Setup Instructions

Follow these steps to get the application running locally and connected to your own Supabase project.

### Step 1: Clone the Repository

If you haven't already, clone the repository to your local machine and install the dependencies:

```bash
git clone <your-repo-url>
cd Fuel-tracker
npm install
```

### Step 2: Set up Supabase

1.  **Create a Supabase Project**:
    *   Go to [Supabase](https://supabase.com/).
    *   Sign in and click **"New Project"**.
    *   Choose an organization, give your project a name (e.g., "Digital Garage"), set a secure database password, and choose a region close to you.
    *   Click **"Create new project"**. It will take a minute or two to provision the database.

2.  **Get Environment Variables**:
    *   In your Supabase project dashboard, navigate to **Project Settings** (the gear icon on the left sidebar) > **API**.
    *   Under **Project URL**, copy the `URL`.
    *   Under **Project API keys**, copy the `anon` `public` key.

3.  **Configure Local Environment**:
    *   Create a file named `.env.local` in the root of the `Fuel-tracker` directory.
    *   Add the variables you copied in the previous step:
        ```text
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        ```

### Step 3: Run Database Migrations (Schema & Seed)

We need to create the required tables (`users`, `vehicles`, `fuel_logs`, `maintenance_logs`) and setup Row Level Security (RLS). You can do this easily through the Supabase SQL Editor.

1.  **Open the SQL Editor**:
    *   In your Supabase project dashboard, click on **SQL Editor** on the left sidebar.
    *   Click **"New query"**.

2.  **Run the Schema Script**:
    *   Copy all the code from the `supabase/schema.sql` file located in this repository.
    *   Paste it into the Supabase SQL Editor.
    *   Click **"Run"** in the bottom right corner.
    *   Check for a "Success" message to ensure the tables and policies were created.

3.  **Enable Email Autoconfirmation (Optional but Recommended for Dev)**:
    *   Go to **Authentication** > **Configuration** > **Sign In / Up** (it used to be under Providers > Email).
    *   Find the **Confirm email** toggle and turn it off to make creating test accounts locally faster. Note: keep this on for production apps.

4.  *(Optional but highly recommended)* **Seed Initial Data**:
    *   After the schema is created, you'll want some mock data to test the UI.
    *   First, you must create a user account. Before running the seed script, run the dev server (Step 4), sign up for an account through the app (if auth UI was implemented), or manually insert a dummy user in the `auth.users` table.
    *   Once you have a User ID (UUID) from Supabase, open `supabase/seed.sql`.
    *   Replace `'YOUR_USER_UUID'` with your actual User UUID.
    *   Copy the modified contents of `seed.sql`, paste it into the Supabase SQL Editor, and click **"Run"**.

### Step 4: Run the Development Server

1.  Start the Next.js development server:

```bash
npm run dev
```

2.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

*   `src/app`: Next.js App Router pages (Dashboard, Fuel Form, Maintenance, Insights).
*   `src/components`: UI components (Shadcn UI, Navbar, Sidebar).
*   `src/store`: Zustand state management (`vehicle-store.ts`).
*   `src/types`: Strict TypeScript definitions mapping to the Supabase schema.
*   `src/utils/supabase`: Supabase Client and Server connection utilities.
*   `supabase/`: SQL scripts for schema generation and initial seed data.

## 🔑 Authentication Note

Currently, the application is wired to read and write records associated with the logged-in user through Supabase RLS policies. To fully interact with the app, ensure you create a login flow or manually set the Supabase user session during development if you removed auth required checks from the root layout.
