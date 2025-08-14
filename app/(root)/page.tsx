import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
import poolDB from "@/database/db";

const Home = async () => {

  const { rows }  = await poolDB.query(
    `SELECT * FROM users`
  );
   
  //  console.log("rows.........................", rows);

  return (
    <>
    <BookOverview {...sampleBooks[0]}/>
    <BookList 
      title="Latest Books"
      books={sampleBooks}
      additionalClassName="mt-28"
    />
    </>
  );
}

export default Home;
