export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "client";
  adresse?: string;
  phone?: string;
  createdAt: Date;
}