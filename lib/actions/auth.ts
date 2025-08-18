"use server"

import { hash } from "bcryptjs"
import { signIn } from "@/authConfig"
import { headers } from "next/headers"
import ratelimit from "@/lib/ratelimit"
import { redirect } from "next/navigation"
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config"
import poolDB from "@/database/db"

// Sign in User
export const signInWithCredentials = async ( params: Pick<AuthCredentials, "email" | "password">) => {
  const { email, password } = params

  // Figure out who’s making the request, then check if they’ve hit their request limit yet."(MORE INFO BELOW)
  // Get the visitor’s IP address
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // Apply a rate limit for that IP
  const { success } = await ratelimit.limit(ip); // from @/lib/ratelimit"
  
  if (!success) return redirect("/too-fast");
  
  try {
    const result = await signIn("credentials", { email, password, redirect: false }) //Info at the bottom
    
    if (result?.error) return { success: false, error: result.error }
    
    return { success: true }
  } catch (error) {
    console.log(error, "Signin error")
    return { success: false, error: "Signin error" }
  }
}

// Sign up new User
export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params
  
  // Figure out who’s making the request, then check if they’ve hit their request limit yet."(MORE INFO BELOW)
  // Get the visitor’s IP address
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // Apply a rate limit for that IP
  const { success } = await ratelimit.limit(ip); // from @/lib/ratelimit"

  if (!success) return redirect("/too-fast");

  const { rows: [existingUser] } = await poolDB.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email])
  if (existingUser) return { success: false, error: "User already exists" }

  const hashedPassword = await hash(password, 10) // the "10" here is salt which determine the complexity of the hashing.

  try {
    await poolDB.query(
      `INSERT INTO users(full_name, email, university_id, password, university_card) VALUES($1, $2, $3, $4, $5)`,
      [fullName, email, universityId, hashedPassword, universityCard]
    )

    await workflowClient.trigger({
      // url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      url: `${config.env.apiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    // Here we automacally sign the new user in after a successful registration.
    await signInWithCredentials({ email, password })

    return { success: true }
  } catch (error) {
    console.log(error, "Signup error")
    return { success: false, error: "Signup error" }
  }
}

/*
"const result = await signIn("credentials", { email, password, redirect: false })"
here we are saying we want to sign in using the "credentials" method
1. await signIn(...)
signIn is an asynchronous function provided by NextAuth.
It returns a Promise that resolves with an object describing the login result.
Using await pauses execution until the login attempt finishes, and stores the result in the result variable.

2. "credentials"
This is the provider ID we set up in your NextAuth config.
We’re telling NextAuth:
"Use the CredentialsProvider to handle this sign-in attempt."
Other examples: "google", "github", "email", etc., but here it’s "credentials" for manual email/password login.

3. { email, password, redirect: false }
This object contains:
email → The email the user entered.
(NextAuth will send this to our Credentials Provider’s authorize() method.)
password → The password entered.
(Also sent to authorize() to verify the user.)

redirect: false →
By default, signIn() redirects to another page after logging in (e.g., /dashboard).
Setting redirect: false tells NextAuth not to redirect automatically.
Instead, it returns the result object so you can decide what to do next (like showing an error toast, or manually redirecting).


----- Ratelimit -----
1. Get the visitor’s IP address
const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
It checks the request headers for "x-forwarded-for" (a common header that stores the real client IP when behind proxies).

If that header doesn’t exist, it falls back to "127.0.0.1" (localhost).

2. Apply a rate limit for that IP
const { success } = await ratelimit.limit(ip);
It calls a ratelimit function with the IP address.
ratelimit.limit(ip) probably checks if that IP has exceeded its allowed requests.
It returns an object (likely with success: true/false) telling you if the request is allowed.

So in plain English: "Figure out who’s making the request, then check if they’ve hit their request limit yet."



*/