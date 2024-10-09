import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable prefer-const */
let cached: Cached = (global as any).mongoose || { conn: null, promise: null };
/* eslint-enable prefer-const */

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

function logConnectionState() {
  console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
}

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
  logConnectionState();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  logConnectionState();
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  logConnectionState();
});

async function connectWithRetry() {
  const maxRetries = Infinity;
  const retryInterval = 10000; // 10 seconds
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await dbConnect();
      break;
    } catch (err) {
      console.error(
        err,
        "Failed to connect to MongoDB, retrying in 10 seconds..."
      );
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      retries++;
    }
  }
}

export { dbConnect, connectWithRetry };
