import express from "express";
import cors from "cors";
import { adminRouter } from "./routes/adminRoute.js";
import { employeeRouter } from "./routes/employeeRoutes.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// Middleware for CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Route middleware
app.use("/auth", adminRouter);
app.use("/employee", employeeRouter);
app.use(express.static("public"));

// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: false, message: "Invalid token" });
      }
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }
};

// Route to verify authentication
app.get("/verify", verifyUser, (req, res) => {
  return res.status(200).json({
    status: true,
    message: "User is authenticated",
    role: req.role,
    id: req.id,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running successfully on port 3000!");
});
