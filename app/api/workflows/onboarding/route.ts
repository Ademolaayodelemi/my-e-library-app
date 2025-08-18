import { serve } from "@upstash/workflow/nextjs"; // Helper to define serverless workflow endpoints
import { sendEmail } from "@/lib/workflow"; // Custom function to send emails
import poolDB from "@/database/db";

// Define possible user activity states
type UserState = "non-active" | "active";

// Define expected initial data for this workflow
type InitialData = {
  email: string;
  fullName: string;
};

// Time constants in milliseconds
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

/**
 * Checks the user's activity state based on last activity date.
 * @param email - The user's email address
 * @returns "active" or "non-active" based on time since last activity
 */
const getUserState = async (email: string): Promise<UserState> => { // Because this function is marked as "async", its return type should be wrapped in a Promise<UserState>
  // Fetch user record by email
    const {rows: [user]} = await poolDB.query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email]
    )

  // If user doesn't exist in the DB, mark as non-active
  if (user.length === 0) return "non-active";

  // Compare current date with last activity date
  const lastActivityDate = new Date(user.lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  // User is considered "non-active" if last activity was between 3 days, but not more than 30 days
  // This creates a middle range of inactivity that qualifies as "non-active".
  // Anything over 30 days is probably treated differently
  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  // Otherwise, they're "active"
  return "active";
};

/**
 * POST handler for the workflow
 * Handles:
 * 1. Sending a welcome email on signup
 * 2. Waiting 3 days and checking activity
 * 3. Sending follow-up emails based on activity state
 * 4. Repeating the check every month
 */
console.log("testing inside onboarding................................................1")
export const { POST } = serve<InitialData>( async (context) => {
  const { email, fullName } = context.requestPayload;
  // Step 1: Send initial welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the Bookish E-Library platform",
      message: `Welcome ${fullName}!`,
    });
  });
  
  // Step 2: Wait 3 days before checking activity
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);
  
  // Step 3: Continuous activity monitoring loop
  while (true) {
    console.log("testing inside onboarding................................................2")
    // Fetch current user state
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    // Step 4: Send tailored follow-up email based on activity
    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Are you still there?",
          message: `Hey ${fullName}, we miss you!`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back!",
          message: `Welcome back ${fullName}!`,
        });
      });
    }

    // Step 5: Wait 1 month before checking again
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
