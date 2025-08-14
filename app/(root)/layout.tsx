import { auth } from "@/authConfig";
import Header from '@/components/Header';
import { redirect } from "next/navigation";
import React, { ReactNode } from 'react'

const layout = async ({children}: {children: ReactNode}) => {

  const session  = await auth();
  // This will prevent navigating to the home page when user has not signed in(i.e no active session)
  if (!session) redirect("/sign-in"); // if false, redirection(to sign-in page) will happen preventing below from execution


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