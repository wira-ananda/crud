const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.get("/pasien", async (req, res) => {
  const allPasien = await prisma.pasien.findMany();

  res.send(allPasien);
});

app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
