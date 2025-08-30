import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
// import { sampleBooks } from "@/constants";
import { auth } from "@/authConfig";
import poolDB from "@/database/db";

const Home = async () => {
  const session = await auth();

  // Please know the difference between "rows: [latestBooks]" AND "rows: latestBooks"
    const { rows: latestBooks }  = await poolDB.query( //latestBooks will be an array of rows
    `SELECT * FROM books ORDER BY created_at DESC LIMIT 20`
  );

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />{/* instead of passing alot of props into "BookOverview" is neater to just spread(...latestBooks[0]) the "...latestBooks[0]" */}
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)} // the rest of the latestBooks after excluding the first item by starting from index 1"".
        additionalClassName="mt-28"
      />
    </>
  );
};

export default Home;











// const Home = async () => {
//  const session = await auth();
//   const { rows }  = await poolDB.query(
//     `SELECT * FROM users`
//   );
   
//   //  console.log("rows.........................", rows);

//   return (
//     <>
//     <BookOverview {...sampleBooks[0]}/>
//     <BookList 
//       title="Latest Books"
//       books={sampleBooks}
//       additionalClassName="mt-28"
//     />
//     </>
//   );
// }

// export default Home;
