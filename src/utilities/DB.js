import mongoose from "mongoose";
const dbUrl = process.env.DBURL;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    console.log("connecting to db");
     await mongoose.connect(dbUrl);

    console.log(`Database connection to MongoDB successful`);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    // Implement retry logic
    // setTimeout(connectDB, 5000);
  }

  mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected. Reconnecting...");
  });
  // reconnect();

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!");
  });
};

let reconnectAttempts = 0;
const maxReconnectAttempts = 3;

const reconnect = () => {
  setTimeout(async (connect,time) => {
    if (reconnectAttempts < maxReconnectAttempts) {
      try {
        await connect(dbUrl);
        console.log("MongoDB reconnected successfully");
        reconnectAttempts = 0;
      } catch (error) {
        console.log("Error reconnecting to MongoDB:", error.message);
        reconnectAttempts++;
        // reconnect();
      }
    } else {
      console.log(
        "Exceeded maximum reconnect attempts. Stopping reconnect attempts."
      );
    }
  },time);
};
const disconnectDB=async()=>{
  try{
   await mongoose.connection.close();
  }catch(error){
    console.error(error)
  }
}
export { connectDB, disconnectDB };
