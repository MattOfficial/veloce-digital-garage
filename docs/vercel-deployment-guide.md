# Beginner's Guide to Hosting Veloce Digital Garage on Vercel

If you've never hosted a web application before, don't worry! This guide will walk you through the process step-by-step using Vercel, which is one of the easiest platforms for hosting Next.js applications like Veloce Digital Garage. 

## Step 1: Getting Your Code on GitHub

Before Vercel can host your app, your code needs to live on a cloud platform like GitHub so Vercel can read it.

1. Go to [GitHub](https://github.com/) and create a free account if you don't have one.
2. Download and install [GitHub Desktop](https://desktop.github.com/) (this makes uploading code much easier for beginners).
3. Open GitHub Desktop, sign in, and go to **File > Add Local Repository**. Select the folder on your computer where your code is saved.
4. Click **Publish repository** in the top right corner. Ensure that "Keep this code private" is checked if you don't want the code visible to the public. 

## Step 2: Creating a Vercel Account and Importing Your Project

1. Go to [Vercel](https://vercel.com/) and sign up. **Sign up using your GitHub account**—this connects Vercel directly to the code you just published!
2. Once logged in, click the **Add New...** button and select **Project**.
3. You will see a list of your GitHub repositories. Find the one you just published and click **Import**.
4. You will be taken to a "Configure Project" screen. **Do not click Deploy just yet!** You need to add Environment Variables first.

## Step 3: Setting Up Environment Variables

Environment variables are secret keys that allow your app to talk to your database securely without exposing the passwords in the code. Your app needs these to function on the live internet.

Find the **Environment Variables** dropdown on the "Configure Project" screen. Add the required keys first, then the optional model overrides if you want to pin model names explicitly:

| Key Name | Where to find the Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Go to your Supabase Project Dashboard > Project Settings (gear icon) > API. Copy the **Project URL**. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | In the exact same Supabase settings page, copy the long key labeled `anon` `public`. |
| `ENCRYPTION_MASTER_KEY` | Use the exact same 64-character hex key you generated when setting up the app locally in your `.env.local` file. |
| `GEMINI_MODEL` | Optional. Leave unset to use the app default, or set your preferred Gemini model override. |
| `OPENAI_MODEL` | Optional. Leave unset to use the app default, or set your preferred OpenAI model override. |
| `DEEPSEEK_MODEL` | Optional. Leave unset to use the app default, or set your preferred DeepSeek model override. |

*Note: You do not add user LLM API keys in Vercel. Users bring their own keys inside the app, and those keys are encrypted before storage. `ENCRYPTION_MASTER_KEY` is the only server-side secret required for that flow. Browser-local AI paths in Edge and Chrome also do not require a server-side provider key, but they depend on the end user's browser support and local model availability.*

Once all variables are added, click the big **Deploy** button! Vercel will now build your app. This usually takes 1 to 3 minutes.

## Step 4: The Crucial Final Step (Updating Redirects)

Once Vercel finishes, you will see congratulations confetti and a live URL (e.g., `https://your-app-name.vercel.app`). **Copy this URL.** 

Right now, if you try to log in, it will fail because Google and Supabase only know about your "localhost" (your personal computer). We have to tell them about your new Vercel website!

### Part A: Update Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) > Project > **Authentication** > **URL Configuration**.
2. Under **Site URL**, paste your live Vercel URL (e.g., `https://your-app-name.vercel.app`).
3. Under **Redirect URLs**, click "Add URL" and paste the same Vercel URL and add `/*` to the end. (Example: `https://your-app-name.vercel.app/*`). Click Save.

### Part B: Update Google Cloud (For Google Sign-In)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services** > **Credentials**.
3. Under "OAuth 2.0 Client IDs", click on the Web Client you created for this project.
4. Scroll down to **Authorized redirect URIs**.
5. Check if your Supabase OAuth callback URL is listed here (it looks like `https://[PROJECT-REFERENCE].supabase.co/auth/v1/callback`). 
6. If you previously added your local server (e.g. `http://localhost:3000/auth/callback`), delete it. **You must ensure the Supabase `.supabase.co` callback URL remains the authorized redirect URI** for the cloud pipeline to work.

## Step 5: Test it out!

Go to your live Vercel URL, click Log In via Google, and everything should work perfectly! You now have a live app on the internet.
