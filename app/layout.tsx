import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import localFont from "next/font/local"
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/authConfig"

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
})

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
})

export const metadata: Metadata = {
  title: "Bookish",
  description:
    "Bookish is a book borrowing university e-library management solution.",
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`} // we'// applying ibmPlexSans using className AND bebasNeue using variable
        >
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  )
}

export default RootLayout

/*
<SessionProvider>
It is a React context provider from next-auth/react.
Wraps your application (usually in _app.js or layout.js) so any component can(have access to ) use hooks like:
useSession() → to get the current session and authentication status.
signIn() / signOut() → to trigger authentication actions.
Without it, those hooks won’t work — they’d return null or undefined.


session={session}
The session prop is the initial session data from the server.
Usually, it comes from getServerSession() or getServerSideProps() so our app knows 
the logged-in user immediately on first render (avoiding a "flash" of unauthenticated state).
This is important for SSR (Server-Side Rendering) because:
Without it, the client would have to fetch the session after rendering, causing a short delay 
where your UI doesn’t know the auth status.

*/ 