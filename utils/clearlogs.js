 import mongoose  from "mongoose"

const clearLogs = async () => {
    try {
      const result = await mongoose.connection.collection('logs').deleteMany({});
      console.log(`${result.deletedCount} log(s) cleared.`);
    } catch (error) {
      console.error("Error clearing logs:", error);
    }
  };

  export  default clearLogs;