import React from "react";
import { Button } from "@/components/ui/button";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { signOutAction } from "@/lib/actions/auth";

const Page = () => {
  return (
    <>
      <form
        action={signOutAction}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;

