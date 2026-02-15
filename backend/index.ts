import express from "express";

import dotenv from "dotenv";
import cors from "cors";
// import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/dbConnect";
import authRoutes from "./routes/authRouter";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOption));
// express.json() parses JSON into a JavaScript object and then it stores it on req.body.
app.use(express.json());
// app.use(bodyParser.json()) ==> Since Express v4.16+ , app.use(express.json()) replaces bodyParser.json()
app.use(express.urlencoded({ extended: true }));
// URL-encoded (form)	express.urlencoded({extended:true})	name=Alice&age=25	{ name: "Alice", age: "25" }
// extended: true allows nested objects in form data & extended: false only allows flat key=value pairs
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

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
