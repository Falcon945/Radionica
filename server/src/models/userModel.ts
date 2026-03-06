import { db } from "../config/db";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
};

type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export const findUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, row: User) => {
        if (error) {
          reject(error);
        } else {
          resolve(row || null);
        }
      }
    );
  });
};

export const createUser = ({
  name,
  email,
  password,
  role = "user"
}: CreateUserParams): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [name, email, password, role],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

export const findUserById = (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (error, row: User) => {
        if (error) {
          reject(error);
        } else {
          resolve(row || null);
        }
      }
    );
  });
};