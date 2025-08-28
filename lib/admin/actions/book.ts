"use server";

import poolDB from "@/database/db";

export const createBook = async (params: BookParams) => {
  const {author, cover_color, cover_url, description, genre, rating, summary, title, total_copies, video_url} = params
  try {
    const {rows: [newBook]} = await poolDB.query(
      `INSERT INTO books (author, cover_color, cover_url, description, genre, rating, summary, title, total_copies, video_url)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
      `,
      [author, cover_color, cover_url, description, genre, rating, summary, title, total_copies, video_url]
    )

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook)),
      // data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};