import { Request, Response } from "express";
import { db } from "../config/db";

export const getReviewsByProduct = (req: Request, res: Response) => {
  const productId = Number(req.params.productId);

  if (!productId) {
    return res.status(400).json({ message: "Neispravan productId." });
  }

  const query = `
    SELECT
      reviews.id,
      reviews.product_id,
      reviews.user_id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      users.name AS user_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.product_id = ?
    ORDER BY reviews.created_at DESC
  `;

  db.all(query, [productId], (error, rows) => {
    if (error) {
      console.error("Error fetching reviews:", error.message);
      return res
        .status(500)
        .json({ message: "Greška pri učitavanju recenzija." });
    }

    return res.json(rows);
  });
};

export const createReview = (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Niste prijavljeni." });
    }

    const userId = user.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res
        .status(400)
        .json({ message: "Product ID i rating su obavezni." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Ocena mora biti od 1 do 5." });
    }

    const query = `
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      query,
      [productId, userId, rating, comment || null],
      function (error) {
        if (error) {
          console.error("Error creating review:", error.message);
          return res
            .status(500)
            .json({ message: "Greška pri dodavanju recenzije." });
        }

        return res.status(201).json({
          message: "Recenzija uspešno dodata.",
          reviewId: this.lastID,
        });
      },
    );
  } catch (error) {
    console.error("Greška pri kreiranju recenzije:", error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};
