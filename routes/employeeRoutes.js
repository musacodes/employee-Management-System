import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.get("/employee-login", (req, res) => {
  const sql = `SELECT * FROM employee WHERE email = ?`;
  con.query(sql, [req.body.email], (error, result) => {
    if (error) {
      return res.status(500).send({
        loginStatus: false,
        errorMessage: "could not login emp",
      });
    }
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password,
        result[0].password,
        (error, respone) => {
          if (error) {
            return res.status(400).json({
              loginStatus: false,
            });
          }
          if (respone) {
            const email = result[0].email;
            const token = jwt.sign(
              { role: "employee", email: email },
              "employee_secret_key",
              {
                expiresIn: "7d",
              }
            );
            res.cookie("token", token);
            return res.status(200).json({
              loginStatus: true,
            });
          }
        }
      );
    } else {
      return res.status(400).send({
        success: false,
        errorMessage: "could not login emp",
      });
    }
  });
});

export { router as employeeRouter };
