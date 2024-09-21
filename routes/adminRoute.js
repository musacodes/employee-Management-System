import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
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

// image upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cs) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage:storage
// })

// //add employee-1.53
// router.post("/add-employee",upload.single('image'), (req, res) => {
//   console.log("log req", req);
//   const sql =
//     "INSERT INTO employee \
//    (`name`,`email`,`password`,`address`,`salary`,`image`,`category_id`) \
//    VALUES (?)";
//   //  we have to hash the password
//   bcrypt.hash(req.body.password.toString(), 10, (error, hash) => {
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errorMessage: "could not Create Employee haser",
//         error,
//       });
//     }
//     const values = [
//       req.body.name,
//       req.body.email,
//       hash,
//       req.body.address,
//       req.body.salary,
//       req.file.filename,
//       req.body.category_id,
//     ];
//     con.query(sql, [values], (error, result) => {
//       if (error) {
//         return res.status(400).json({
//           success: false,
//           errorMessage: "could not Create Employee query",
//           error,
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         errorMessage: "Employee Has been Added Successfully !",
//       });
//     });
//   });
// });

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Directory for storing uploaded images
  },
  filename: (req, file, cb) => {
    // Create a unique filename for each uploaded file
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Add employee route
router.post("/add-employee", upload.single('image'), (req, res) => {
  console.log("Received request:", req.body);

  // SQL query for inserting employee data into the database
  const sql = `
    INSERT INTO employee
    (name, email, password, address, salary, image, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Hash the password before storing it in the database
  bcrypt.hash(req.body.password.toString(), 10, (error, hash) => {
    if (error) {
      return res.status(500).json({
        success: false,
        errorMessage: "Could not hash the password",
        error,
      });
    }

    // Create an array of values to insert
    const values = [
      req.body.name,
      req.body.email,
      hash, // Use the hashed password
      req.body.address,
      req.body.salary,
      req.file ? req.file.filename : null, // Handle image filename, or null if no image
      req.body.category_id,
    ];

    // Execute the SQL query
    con.query(sql, values, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          errorMessage: "Could not create employee",
          error,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Employee has been added successfully!",
      });
    });
  });
});


export { router as adminRouter };
