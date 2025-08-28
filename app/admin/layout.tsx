import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"
import { ReactNode } from 'react'
import { auth } from "@/authConfig"
import poolDB from "@/database/db"
import { redirect } from "next/navigation"


const layout = async ({children}: {children: ReactNode}) => {
    const session = await auth();

  if (!session?.user?.id) redirect("/sign-in"); 

  
  const {rows} = await poolDB.query(`
      SELECT COALESCE((role = 'ADMIN'), FALSE) AS "isAdmin"
      FROM users
      WHERE id = $1
      LIMIT 1`,
      [session?.user?.id]
  )
  console.log("rows[0].isAdmin........", rows[0].isAdmin)
  if (!rows[0].isAdmin) redirect("/");
  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <div className="admin-right-container">
         <Header session={session} />
      <p>Header</p>
        {children}
      </div>
    </main>
  )
}

export default layout

/*
--------------- DIFFERENCE between (role = 'ADMIN') and COALESCE((role = 'ADMIN'), FALSE) ---------------
(role = 'ADMIN')
This is a comparison expression.
It checks whether the value in the role column is equal to the string 'ADMIN'.
In PostgreSQL, a comparison like this returns a boolean:
TRUE if role is 'ADMIN'
FALSE otherwise
NULL if role itself is NULL

COALESCE((role = 'ADMIN'), FALSE)
COALESCE is a PostgreSQL function that returns the first non-NULL value from its arguments.
Syntax: COALESCE(value1, value2, ..., valueN)
In our case:
If (role = 'ADMIN') is TRUE → COALESCE returns TRUE
If (role = 'ADMIN') is FALSE → COALESCE returns FALSE
If (role = 'ADMIN') is NULL (e.g., no row exists) → COALESCE returns FALSE


AS "isAdmin"
This renames the result of the expression.
*/ 