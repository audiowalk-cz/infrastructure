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

const token = {
  secret: process.env["TOKEN_SECRET"] || "secret",
};

export const Config = {
  auth,
  data,
  server,
  token,
};
