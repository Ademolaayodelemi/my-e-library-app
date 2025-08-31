import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import poolDB from "./database/db"

// Export NextAuth handlers and helpers
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Use JWT strategy for managing sessions (no database sessions)
  session: {
    strategy: "jwt",
  },

  // Define authentication providers
  providers: [
    // Custom username/password login via CredentialsProvider
    CredentialsProvider({
      // Function to authorize a user with credentials
      async authorize(credentials) {
        // If email or password is missing, deny access
        if (!credentials?.email || !credentials?.password) return null

        // Query database to find user by email
        const { rows: [user] } = await poolDB.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [
          // credentials.email.toString()
          credentials.email
        ])

        // If no user is found, deny access
        if (!user) return null

        // Compare provided password with stored hashed password
        const isPasswordValid = await compare(
          credentials.password.toString(),
          user.password
        )

        // If password does not match, deny access
        if (!isPasswordValid) return null

        // Return user info to be encoded in JWT
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
        } as User // User is a NextAuth type/interface
      },
    }),
  ],

  // Define custom sign-in page
  pages: {
    signIn: "/sign-in",
  },

  // Callback functions for handling JWT and session behavior
  callbacks: {
    // Runs when a JWT is created or updated
    async jwt({ token, user }) {
      // If it's the initial sign-in, add user info(id and name) to token
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token // Return modified/updated or unchanged token
    },

    // Runs whenever a session is checked
    async session({ session, token }) {
      // Attach user ID and name from token to session
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
      }
      return session // Return modified session object
    },
  },
})


