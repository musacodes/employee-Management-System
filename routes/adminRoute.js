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

// in node mysql () is mentioned to provide columns seperated by ,
// and ? is used as a place-holder in respective way
router.post("/add-category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (error, result) => {
    if (error) {
      return res.status(500).json({
        status: false,
        errorMessage: "Error in POST category api",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Category has been Added",
    });
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * from category";
  con.query(sql, (error, result) => {
    if (error) {
      return res.status(500).json({
        status: false,
        errorMessage: "Could GET All Categories",
      });
    }
    return res.status(200).send({
      status: true,
      categories: result,
    });
  });
});

export { router as adminRouter };
