import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel";

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

type LoginParams = {
  email: string;
  password: string;
};

type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthResponse = {
  token: string;
  user: SafeUser;
};

const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwtSecret;
};

export const registerUser = async ({
  name,
  email,
  password
}: RegisterParams): Promise<AuthResponse> => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser({
    name,
    email,
    password: hashedPassword,
    role: "user"
  });

  const token = jwt.sign(
    {
      userId,
      email,
      role: "user"
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: userId,
      name,
      email,
      role: "user"
    }
  };
};

export const loginUser = async ({
  email,
  password
}: LoginParams): Promise<AuthResponse> => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};