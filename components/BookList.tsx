import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  books: Book[];
  additionalClassName?: string;
}

const BookList = ({ title, books, additionalClassName }: Props) => {
  if (books.length < 2) return;
  return (
    <section className={additionalClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;