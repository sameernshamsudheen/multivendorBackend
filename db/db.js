import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

    console.log(`dbconnected ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error.message);
    setInterval(connectDb, 3000);

    // throw new Error(" connection is  not correct");
  }
};

export default connectDb;
