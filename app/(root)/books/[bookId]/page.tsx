import { redirect } from "next/navigation";
import { auth } from "@/authConfig";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import poolDB from "@/database/db";

const Page = async ({ params }: { params: Promise<{ bookId: string }> }) => {

  const { bookId } = (await params);

  const session = await auth();

  // Fetch data based on id
  const {rows: [bookDetails]} = await poolDB.query(`
    SELECT * FROM books WHERE id = $1 LIMIT 1
  `, [bookId]);

  if (!bookDetails) redirect("/404");


  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />{/* instead of passing alot of prop into "BookOverview" is neater to just spread(...bookDetails) the "bookDetails" */}

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.video_url} />
          </section>

          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line: string, i: string ) => ( // we use ".split("\n")" to break it into lines, convert to array and "map" over it.
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>

        </div>

        {/*  SIMILAR*/}
      </div>
    </>
  );
};
export default Page;