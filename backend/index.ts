import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/dbConnect";

import authRoutes from "./routes/authRouter";
import productRoutes from "./routes/productRouter";
import cardRoutes from "./routes/cartRouter";
import wishListRoutes from "./routes/wishListRouter";
import addressRoutes from "./routes/addressRouter";
import userRoutes from "./routes/userRouter";

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
//Browsers block requests between different origins
app.use(cors(corsOption)); //Origin = Protocol + Domain + Port ==> http://localhost:3000

app.use(express.json()); // parses JSON payload into a JavaScript object and then it stores it on req.body.
// app.use(bodyParser.json()) ==> Since Express v4.16+ , app.use(express.json()) replaced bodyParser.json()
app.use(express.urlencoded({ extended: true }));
// When a form is submitted, the browser sends data using the format:application/x-www-form-urlencoded vs application/json
// If a form sends data like ==> name=raj&age=20, it converts it into a JavaScript object ==> req.body = { name: "Raj", age: "20"}
// extended: true allows nested objects in form data & extended: false only allows flat key=value pairs
app.use(cookieParser()); //Cookie: user=raj; theme=dark to req.cookies = {user: "raj",theme: "dark"}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cardRoutes);
app.use("/api/v1/wishList", wishListRoutes);
app.use("/api/v1/user/address", addressRoutes);
app.use("/api/v1/user", userRoutes);

async function startServer() {
  try {
    await connectDb(); // wait for DB connection
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
    process.exit(1);
  }
}

startServer();
