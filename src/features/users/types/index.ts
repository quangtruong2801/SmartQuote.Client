export type User = {
  id: number;
  username: string;
  role: string;
}

export type CreateUserRequest = {
  username: string;
  password: string;
  role: string;
}