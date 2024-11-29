export interface Book {
  id: number;
  title: string;
  author: string;
  subject: string;
  chapters: number;
  difficulty: string;
  category: string;
  course: string;
}

export type BookMaterial = {
  material_type: "book" | "article" | "video";
  material_title: string;
  material_description: string;
  author: string;
  visibility: boolean;
  library_id: string;
  updated_at: string;
  created_at: string;
  user_id: string;
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone_number: string;
  user_id: string;
  branch_id: string;
  username: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  expire: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  userRole: string | null;
  login: (token: string, data: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isLoading: boolean;
  loginError: string | null;
  isInitializing: boolean;
};

export type Admin = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone_number: string;
  branch_id: string;
  username: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  updated_at: string;
};
