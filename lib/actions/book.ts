"use server";

import dayjs from "dayjs";
import poolDB from "@/database/db";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    // const { rows: [availableCopies] } = await poolDB.query(`
    //   SELECT available_copies FROM books WHERE id = $1 LIMIT 1
    //   `, [bookId])

    // with "COALESCE()" availableCopies is guaranteed to be a number (0 if the book doesn’t exist).
    const { rows: [book] } = await poolDB.query(
      `SELECT COALESCE((
          SELECT available_copies
          FROM books
          WHERE id = $1
          LIMIT 1
        ), 0) AS available_copies`, 
      [bookId]
    );

    const availableCopies = book.available_copies; // always a number

    if (!book.length || availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }
    // We can pass a dynamic vaiable here instead of the hardcoded 7
    const dueDate = dayjs().add(7, "day").toDate().toDateString(); // Explanation at the bottom
    console.log("dueDate................................", dueDate);

    // PLEASE READ BELOW: why we hardcoded "BORROWED" in "VALUES ($1, $2, $3, 'BORROWED')"
    const { rows: [record] } = await poolDB.query(
      `INSERT INTO borrow_records (user_id, book_id, due_date, status)
      VALUES ($1, $2, $3, 'BORROWED')
      RETURNING *`, [userId, bookId, dueDate]
    );
    
    // GREATEST(a, b) ensures the value never drops below the larger of the two — in this case, 0.
    // If available_copies is already 0, it will stay 0
    await poolDB.query(
      `UPDATE books
      SET available_copies = GREATEST(available_copies - 1, 0)
      WHERE id = $1
      RETURNING *`,
      [bookId]
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);
    
    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
/*
 ---------- why we hardcoded "BORROWED" in "VALUES ($1, $2, $3, 'BORROWED')" ----------
  since a borrow record should logically always start as "BORROWED". Later, you’d use an UPDATE query to change it to "RETURNED" or "OVERDUE".
  Above we hardcoded "BORROWED" because new records are always "BORROWED" on creation which
  prevents mistakes (e.g., accidentally inserting "RETURNED" when creating a borrow record).

  ---------- dayjs().add(7, "day").toDate().toDateString() ----------
  dayjs(): Creates a new dayjs object with the current date and time (like new Date() but wrapped in the dayjs library).

.add(7, "day"): Adds 7 days to the current date. If today is 31 Aug 2025, this makes the date 7 Sep 2025.

.toDate(): Converts the dayjs object back into a native JavaScript Date object.

.toDateString(): Calls the built-in JavaScript Date.prototype.toDateString() method, which formats the date into a human-readable string like: "Sun Sep 07 2025"

✅ Final result: dueDate will be a string representing the date exactly 7 days from today in the format: "Day Mon DD YYYY"
You also keep it as a Date object (instead of a string) or format it in different ways with dayjs?
*/ 
