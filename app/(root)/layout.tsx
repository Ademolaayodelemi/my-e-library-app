import { auth } from "@/authConfig";
import Header from '@/components/Header';
import poolDB from "@/database/db";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { ReactNode } from 'react'

const layout = async ({children}: {children: ReactNode}) => {

  const session  = await auth();
  // This will prevent navigating to the home page when user has not signed in(i.e no active session)
  if (!session) redirect("/sign-in"); // if false, redirection(to sign-in page) will happen preventing below from execution

  after(async () => {
  // No need to check `!session?.user?.id` here —
  // earlier redirect already ensures only authenticated users reach this code.

  // 1. Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10); // slice(0, 10) extract "2025-08-15" from "2025-08-15T16:20:45.123Z"

  // 2. Fetch the current user record from the database
  const { rows: [user] } = await poolDB.query(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`,
    [session?.user?.id]
  );

  // 3. If the last activity date is already today, skip the update
  if (user.last_activity_date === today) {
    return; // Nothing to update
  }

  // 4. Otherwise, update last_activity_date to today's date
  await poolDB.query(
    `UPDATE users
     SET last_activity_date = $1
     WHERE id = $2`,
    [today, session?.user?.id]
  );
});


  return (
    <main className="root-container">
      <div className='mx-auto nax-w-7xl'>
        <Header/>

        <div className="mt-20 pb-20">
          {children}
        </div>
      </div>
    </main>
  )
}

export default layout;