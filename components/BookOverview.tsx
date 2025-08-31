import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import poolDB from "@/database/db";
import BorrowBook from "@/components/BorrowBook";


interface Props extends Book {
  userId: string;
}
const BookOverview = async ({ id, userId, title, author, genre, rating, cover_image_url, cover_color, description, total_copies, available_copies }: Props) => {

  const { rows: [user] } = await poolDB.query(
  `SELECT *
   FROM users
   WHERE id = $1
   LIMIT 1`,
  [userId]
);

  const borrowingEligibility = {
    isEligible: available_copies > 0 && user?.status === "APPROVED",
    message: available_copies <= 0 ? "Book is not available" : "You are not eligible to borrow this book",
  }

  return (
    <section className="book-overview">

      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>By <span className="font-semibold text-light-200">{author}</span></p>
          <p>Category{" "}<span className="font-semibold text-light-200">{genre}</span></p>
          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>Total Books <span>{total_copies}</span></p>
          <p>Available Books <span>{available_copies}</span></p>
        </div>

        <p className="book-description">{description}</p>

        {user && (
          <BorrowBook
            bookId={id}
            userId={userId}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>


      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide" 
            className="z-10"
            coverColor={cover_color}
            coverImageUrl={cover_image_url}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={cover_color}
              coverImageUrl={cover_image_url}
            />
          </div>
        </div>
      </div>


    </section>
  );
};

export default BookOverview;