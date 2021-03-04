import { config } from "dotenv";

const { parsed } = config();

export const {
  DB,
  MODE,
  SECRET,
  BASE_URL,
  URL = `${BASE_URL}${parsed.PORT}`,
  IN_PROD = MODE !== "prod",
} = parsed;

export const PORT = process.env.PORT || parsed.PORT;
