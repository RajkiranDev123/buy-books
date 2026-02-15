import mongoose from "mongoose";

// const add = (a: number, b: number): number => {
//   return a + b;
// };

// const getMessage = async (): Promise<void> => {
//   return "Hello";
// };

// async function fetchMessage(): Promise<void> {
//   return "Hello";
// }

// If MongoDB fails to connect, the server should not start.
// 1 signals failure to the OS (useful in deployment, Docker, CI/CD).
//If the database connection fails, our app cannot work properly.

export const connectDb = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`DB Connected!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//type assertion : When you know the type better than the compiler.
