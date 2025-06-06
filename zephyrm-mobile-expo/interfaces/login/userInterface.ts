/**
 * Interface for user data
 *
 * @module interfaces/login/userInterface
 */

export interface AuthUser {
  uid: string;
  name: string;
  counter: number;
  role: Role;
}

type Role = "admin" | "worker" | "";

export interface User {
  uid: string;
  name: string;
  role: Role;
  email: string;
}
