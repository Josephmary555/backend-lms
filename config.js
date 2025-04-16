// config.js
import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGO_URI,
};

export default config;
