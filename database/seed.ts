import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { config } from "dotenv";


config({ path: ".env.local" })

// will have to make a seperate connection to the database because this is a stand-alone file we cannot use the previous 
// connection because we will not be running this file from a typical NextJS application(this is a stand-alone file) and it will be run using the package.json script(remember to add it there). 
// Will be running it as a  script from a package file like running a seperate node file
import { Pool } from "pg"
// Server connection
const poolDB = new Pool({
  // connectionString: process.env.LOCAL_DATABASE_URL!, Local DB
  connectionString: process.env.DATABASE_URL!, //Neon(cloud) DB
  ssl: { rejectUnauthorized: false }, // required for Neon
});

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async ( url: string, fileName: string, folder: string ) => {
  try {
    const response = await imagekit.upload({ file: url, fileName, folder });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
  }
};

const mySeed = async () => {
  try {
    for (const book of dummyBooks) { // "for of" statement loops through the values of an iterable object. 
    // NOTE: WITH THIS "for loop" THIS WILL RUN AND PERFORM ALL PROCESS FOR EACH ITEM OF THE "dummyBooks.json" 
      const cover_image_url = (await uploadToImageKit( book.cover_image_url, `${book.title}.jpg`, "/books/covers" )) as string;
    // "cover_image_url and video_url" name must be the same as they are in the "dummyBooks.json" and in the "database"
      const video_url = (await uploadToImageKit( book.video_url, `${book.title}.mp4`, "/books/videos" )) as string;

    // PLEASE NOTE: "cover_image_url and video_url" are NOT included in the values destructured out of "book" because we are using the ones above INSTEAD of the "cover_image_url and video_url" from the "dummyBooks.json"
      const { title, author, genre, rating, total_copies, available_copies, cover_color, summary, description } = book //("cover_image_url and video_url" NOT included

      await poolDB.query(
        `INSERT INTO books ( title, author, genre, rating, total_copies, available_copies, cover_image_url, video_url, cover_color, summary, description )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 );
        `,[title, author, genre, rating, total_copies, available_copies, cover_image_url, video_url, cover_color, summary, description]
      )
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

mySeed();
