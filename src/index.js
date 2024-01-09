const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.get("/pasien", async (req, res) => {
  const allPasien = await prisma.pasien.findMany();

  res.send(allPasien);
});

app.post("/pasien", async (req, res) => {
  const addPasien = req.body;

  const pasien = await prisma.pasien.create({
    data: {
      nama: addPasien.nama,
      keluhan: addPasien.keluhan,
      kunjungan: addPasien.kunjungan,
    },
  });

  res.send({
    data: pasien,
    message: "Berhasil",
  });
});

app.post("/pasien", async (req, res) => {
  const addPasien = req.body;

  const pasien = await prisma.pasien.create({
    data: {
      nama: addPasien.nama,
      keluhan: addPasien.keluhan,
      kunjungan: addPasien.kunjungan,
    },
  });

  res.send({
    data: pasien,
    message: "Berhasil",
  });
});

app.delete("/pasien/:noPasien", async (req, res) => {
  const noPasien = req.params.noPasien;

  await prisma.pasien.delete({
    where: {
      noPasien: parseInt(noPasien),
    },
  });

  res.send("Berhasil Dihapus");
});

app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
