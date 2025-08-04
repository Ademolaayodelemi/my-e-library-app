"use server";

import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
// import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";
import poolDB from "@/database/db";

export const signInWithCredentials = async ( params: Pick<AuthCredentials, "email" | "password"> ) => {
  
  const { email, password } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", { email, password, redirect: false }); //here we are saying we want to sign in using the "credentials" method

    if (result?.error) return { success: false, error: result.error };

    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {

  const { fullName, email, universityId, password, universityCard } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) return redirect("/too-fast");

  const {rows: [existingUser] } = await poolDB.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  )
  if ( existingUser ) return { success: false, error: "User already exists" };

  const hashedPassword = await hash(password, 10);

  try {
    await poolDB.query(
      `INSERT INTO users(full_name, email, university_id, password, university_card) VALUES($1, $2, $3, $4, $5)`,
      [fullName, email, universityId, hashedPassword, universityCard]
    )
  
    // await workflowClient.trigger({
    //   url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
    //   body: {
    //     email,
    //     fullName,
    //   },
    // });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
