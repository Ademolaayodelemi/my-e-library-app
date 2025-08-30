import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.email(),
  universityId: z.coerce.number(), // In Zod, z.coerce.number() is used to automatically convert (coerce) input values into a number—even if they come in as strings.
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().min(1).max(5),// In Zod, z.coerce.number() is used to automatically convert (coerce) input values into a number—even if they come in as strings.
  total_copies: z.coerce.number().int().positive().lte(10000),
  cover_image_url: z.string().nonempty(),
  video_url: z.string().nonempty(),
  summary: z.string().trim().min(10),
  cover_color: z.string().trim().regex(/^#[0-9A-F]{6}$/i), // see explanation below
});

/*
/ ... / → the delimiters for the regex pattern.
^ → start of the string.
# → literal # character (so the string must start with #).
[0-9A-F] → a character class: allows digits 0–9 and letters A–F.
{6} → exactly 6 of the preceding characters (so 6 hex digits).
$ → end of the string.
i → case-insensitive flag (so a–f also allowed, not just A–F).

👉 In plain English:
This regex matches a hex color code in the format #RRGGBB.
Examples that match ✅:
#FFFFFF
#000000
#1a2b3c

Examples that do NOT match ❌:
123456 (missing #)
#FFF (only 3 digits, not 6)
#ZZZZZZ (Z is not a valid hex digit)

*/ 
