import { readFileSync } from "fs";
import * as path from "path";

const auth = {
  secret: "",
};

const server = {
  port: 3000,
  host: "127.0.0.1",
};

const data = {
  rootDir: "./data",
};

const packageJson = readFileSync(path.join(__dirname, "..", "package.json"), "utf-8");

const project = {
  name: JSON.parse(packageJson).name,
  version: JSON.parse(packageJson).version,
  description: JSON.parse(packageJson).description,
};

export const Config = {
  auth,
  data,
  project,
  server,
};
