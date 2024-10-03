import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/employee-login", (req, res) => {
  console.log("emails", req.body.email, req.body.password);

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
              { role: "employee", email: email, id: result[0].id},
              "jwt_secret_key",
              {
                expiresIn: "7d",
              }
            );
            res.cookie("token", token);
            return res.status(200).json({
              loginStatus: true,
              id: result[0].id,
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

router.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(400).json({
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      result: result,
    });
  });
});

router.get("/employee/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: true,
  });
});

export { router as employeeRouter };
