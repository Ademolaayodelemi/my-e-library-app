interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  cover_color: string;
  cover_url: string;
  summary: string;
  video_url: string;
  isLoanedBook: boolean;
  created_at: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  cover_url: string;
  cover_color: string;
  description: string;
  total_copies: number;
  video_url: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
