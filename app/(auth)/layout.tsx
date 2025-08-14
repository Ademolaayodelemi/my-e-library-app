import { ReactNode } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/authConfig";

const Layout = async ({ children }: { children: ReactNode }) => {

  const session = await auth();
  // This will prevent navigating to the sign-in page when user has already signed in(i.e active session)
  if (session) redirect("/"); // if true, redirection(to home page) will happen preventing below from execution

  return (
    <main className="auth-container">

      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">Bookish</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
      
    </main>
  );
};

export default Layout;