import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/admin-login", (req, res) => {
  const sql = "SELECT * from admin WHERE email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.status(500).json({
        loginStatus: false,
        errorMessage: "Query Error POST",
      });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email },
        "jwt_secret_key",
        {
          expiresIn: "7d",
        }
      );
      res.cookie("token", token);
      return res.status(200).json({
        loginStatus: true,
      });
    } else {
      return res
        .status(401)
        .json({ loginStatus: false, errorMessage: "wrong emial or password" });
    }
  });
});

export { router as adminRouter };
