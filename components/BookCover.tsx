// "use client";

import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
// import { IKImage } from "imagekitio-next";
// import config from "@/lib/config";
import Image from "next/image";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide"; //This is a union type of allowed variant names.
// This is saying the keys in "BookCoverVariant" must be "extraSmall", "small", "medium", "regular" and "wide" and the values must be "string" <BookCoverVariant, string>
// You must include all BookCoverVariant keys (no extras, none missing) and each value must be the type sprcified here(string) <BookCoverVariant, string>
const variantStyles: Record<BookCoverVariant, string> = { //This is type "Record". More explanation at the bottom
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant; // "BookCoverVariant" can also be used directly as a type NOT ONLY as keys (as used above)
  coverColor: string;
  coverImage: string;
}

const BookCover = ({ className, variant = "regular", coverColor = "#012B48", coverImage = "https://placehold.co/400x600.png" }: Props) => {
//"regular" is the default value of "variant" 
  return (
    <div className={cn( "relative transition-all duration-300", variantStyles[variant], className )}>
      <BookCoverSvg coverColor={coverColor} />
      <div className="absolute z-10" style={{ left: "12%", width: "87.5%", height: "88%" }}>
        {/* <IKImage
          path={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Book cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        /> */}
        <Image
            src={coverImage}
            alt="Book cover"
            fill
            className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};
export default BookCover;






  /*
  ---- Record<BookCoverVariant, string> ----
  This says: for each possible BookCoverVariant key, assign a string value (a CSS class in this case).
  with "Record<BookCoverVariant, string>" we are passing in the keys(BookCoverVariant) that the object (variantStyles) must 
  have, and also, what the type(string) must be. 
  You must include all BookCoverVariant keys (no extras, none missing). each value must be a string.
 
  you can have a mixture of string and other types in the Record
  we can also have const variantStyles: Record<BookCoverVariant, string | number | boolean>

  Option 2: More Precise Types (Per Key)
If each key should have a different value type, then use a custom object type instead of Record:

type BookCoverVariant = 'hardcover' | 'paperback' | 'ebook';

const variantStyles: {
  hardcover: string;
  paperback: number;
  ebook: boolean;
} = {
  hardcover: "bg-blue-500",
  paperback: 42,
  ebook: true
};

------------ variantStyles[variant] ------------
Note: In variantStyles[variant] variant is a placeholder that could be any value
There are two ways to access a property: object.property or object["property"]
So instead of saying "variantStyles.regular" directly we use object["property"] (variantStyles[variant]) style
So the value of "variant" will be based on the prop passed to the component.

----- variant?: BookCoverVariant----
"?" is used for incase we are manually passing in(hard-coding) a "default" value in "variant" instead of using from BookCoverVariant
  */
