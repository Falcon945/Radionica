export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};