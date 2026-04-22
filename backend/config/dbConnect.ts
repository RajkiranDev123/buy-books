import mongoose from "mongoose";

// const add = (a: number, b: number): number => {
//   return a + b;
// };

// const getMessage = async (): Promise<void> => {
//   return "Hello";
// };

// async function getMessage(): Promise<void> {
//   return "Hello";
// }

// If MongoDB fails to connect, the server/app should not start.
// 1 signals failure to the OS (useful in deployment, Docker, CI/CD).


const connectWithRetry = async (retries = 5): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("DB Connected !");
  } catch (error) {
    console.log("DB connection failed ❌", error);

    if (retries === 0) {
      console.log("No retries left. Exiting...");
      process.exit(1);
    }

    console.log(`Retrying... attempts left: ${retries}`);

    setTimeout(() => {
      connectWithRetry(retries - 1);
    }, 5000);
  }
};

// even without return keyword, an async function still returns a Promise. , that's why ==> Promise<void>
export const connectDb = async (): Promise<void> => {
  await connectWithRetry();
};

//type assertion : When you know the type better than the compiler : as syntax (most common)
