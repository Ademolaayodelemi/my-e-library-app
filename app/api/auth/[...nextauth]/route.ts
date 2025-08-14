import { handlers } from "@/authConfig"

export const { GET, POST } = handlers

/*
The "[...nextauth]" part in /app/api/auth/[...nextauth]/route.ts is a Next.js catch-all dynamic route segment.


1️⃣ Dynamic Route Segments
In Next.js, square brackets [] make a dynamic route.
Example:
/pages/user/[id].ts → /user/123 → id = "123" in params.

2️⃣ Catch-All Dynamic Segments
Adding three dots ... inside the brackets means catch-all — it matches one or more path segments and gives them to you as an array.
Example:
/pages/docs/[...slug].ts
URL /docs/a → slug = ["a"]
URL /docs/a/b/c → slug = ["a", "b", "c"]

3️⃣ Why [...nextauth] for NextAuth.js?
NextAuth creates multiple API routes internally for different actions, like:
/api/auth/signin
/api/auth/signout
/api/auth/callback/...
/api/auth/session
Instead of making separate files for each one, [...nextauth] catches all these paths so NextAuth can handle them in a single handler function.

4️⃣ In the App Router
In /app/api/auth/[...nextauth]/route.ts, that single route.ts file will handle:
/api/auth/signin
/api/auth/signout
/api/auth/session
/api/auth/callback/google (or other providers)
and so on.


"[...nextauth] is a wildcard folder name that grabs any URL that starts with /api/auth/ and 
passes the rest to NextAuth."

here’s the visual flow of how [...nextauth] in /app/api/auth/[...nextauth]/route.ts works for NextAuth:

/app
  /api
    /auth
      /[...nextauth]
        route.ts

Incoming Requests
Any request starting with /api/auth/ will get routed here:
/api/auth/signin         →   [...nextauth] = ["signin"]
/api/auth/signout        →   [...nextauth] = ["signout"]
/api/auth/session        →   [...nextauth] = ["session"]
/api/auth/callback/google →   [...nextauth] = ["callback", "google"]
/api/auth/callback/github →   [...nextauth] = ["callback", "github"]


Key Point
[...nextauth] acts like a universal door for all /api/auth/* routes, and NextAuth internally decides what to do based on the path segments inside params.nextauth.
*/ 