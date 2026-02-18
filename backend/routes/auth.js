import express from "express";
import bcrypt from "bcrypt";
import sql from "../config/db.js"; // Importă conexiunea ta sql
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists =
      await sql`SELECT * FROM users WHERE username = ${username}`;
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Utilizatorul există deja" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await sql`
            INSERT INTO users (username, password_hash)
            VALUES (${username}, ${hashedPassword})
            RETURNING id, username, created_at
        `;

    console.log("✅ Utilizator înregistrat cu succes");
    res.status(201).json({
      message: "Cont creat cu succes!",
      user: newUser[1],
    });
  } catch (err) {
    console.error("❌ Eroare la înregistrare:", err.message);
    res.status(500).json({ message: "Eroare de server" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await sql`SELECT * FROM users WHERE username = ${username}`;

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Email sau parolă incorectă" });
    }

    const user = users[0];
    console.log(user[0]);

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Email sau parolă incorectă" });
    }

    console.log(`✅ Utilizatorul ${user.username} s-a logat.`);
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    res.json({
      success: true,
      message: "Login reușit!",
      redirectUrl: "/home",
      token
    });
  } catch (err) {
    console.error("❌ Eroare la login:", err.message);
    res.status(500).json({ success: false, message: "Eroare de server" });
  }
});

export default router;
