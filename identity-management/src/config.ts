import { readFileSync } from "fs";
import path from "path";

const packageJson = readFileSync(path.join(__dirname, "..", "package.json"), "utf-8");

const project = {
  name: JSON.parse(packageJson).name,
  version: JSON.parse(packageJson).version,
  description: JSON.parse(packageJson).description,
};

const server = {
  port: process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000,
  host: process.env["HOST"] || "127.0.0.1",
};

const token = {
  secret: process.env["TOKEN_SECRET"] || "secret",
};

export const Config = {
  project,
  server,
  token,
};
