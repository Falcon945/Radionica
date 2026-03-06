import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/init";
import { seedDatabase } from "./database/seed";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initializeDatabase();
seedDatabase();

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Online shop server is running."
  });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});