"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}


/*
Due to the update we can now write:
toast.error("Something went wrong");
toast.success("Action completed successfully");
toast.info("Extra information");
*/ 

const BorrowBook = ({ userId, bookId, borrowingEligibility: { isEligible, message }}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrowBook = async () => {
  if (!isEligible) {
    toast.error(message || "You are not eligible to borrow this book");
    return;
  }

  setBorrowing(true);

  try {
    const result = await borrowBook({ bookId, userId });

    if (result.success) {
      toast.success("Book borrowed successfully");

      router.push("/");
    } else {
      toast.error(result.error || "Could not borrow the book");
    }

  } catch (error) {
    console.log(error)
    toast.error("An error occurred while borrowing the book");
  } finally { // The finally statement defines a code block to run regardless of the result(either successfull or fail).
    setBorrowing(false); // to stop the loading...
  }
};



  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing ..." : "Borrow Book"}
      </p>
    </Button>
  );
};
export default BorrowBook;