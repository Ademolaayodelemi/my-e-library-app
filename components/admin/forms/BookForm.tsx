"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "sonner";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useForm, Controller } from "react-hook-form";

interface Props extends Partial<Book> { //Partial changes all the properties in an object to be optional.
  type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();

  // const form = useForm<z.infer<typeof bookSchema>>({
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genre: "",
      rating: 1,
      total_copies: 1,
      cover_url: "",
      cover_color: "",
      video_url: "",
      summary: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {

    console.log("value.............", values)
    const result = await createBook(values);

    if (result.success) {
      toast(
        "Book created successfully",
      );

      router.push(`/admin/books/${result.data.id}`); // this will instantly take us to the newly created book page
    } else {
      toast.error(  // there is also "toast.success()" for success
        `Error  ${result.message} ?? An error occurred.`,
      )
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book title"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"author"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Author
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book author"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"genre"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Genre
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book genre"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Book rating"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"total_copies"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Total Copies
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Total copies"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"cover_url"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Image
              </FormLabel>
              <FormControl>
                <FileUpload
                  type="image"
                  accept="image/*" // "image/*" means accept all kind of image type.
                  placeholder="Upload a book cover"
                  folder="books/covers" // it be create and subsequently store all images a folder called "books/covers"" on imakeKit platform
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"cover_color"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Primary Color
              </FormLabel>
              <FormControl>
                <ColorPicker
                  onPickerChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book description"
                  {...field}
                  rows={10}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"video_url"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Trailer
              </FormLabel>
              <FormControl>
                <FileUpload
                  type="video"
                  accept="video/*" // "video/*" means accept all kind of video type.
                  placeholder="Upload a book trailer"
                  folder="books/videos" // it be create and subsequently store all images a folder called "books/video"" on imakeKit platform
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"summary"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Book Summary
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book summary"
                  {...field}
                  rows={5}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="book-form_btn text-white">
          Add Book to Library
        </Button>
      </form>
    </Form>
  );
};
export default BookForm;