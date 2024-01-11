const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;

app.get("/pasien", async (req, res) => {
  const allPasien = await prisma.pasien.findMany();

  res.send(allPasien);
});

app.post("/pasien", async (req, res) => {
  const addPasien = req.body;

  try {
    const existingPasien = await prisma.pasien.findFirst({
      where: {
        nama: addPasien.nama,
        gender: addPasien.gender,
        alamat: addPasien.alamat,
      },
    });
    let updatedKeluhan;

    if (existingPasien) {
      updatedKeluhan = `${addPasien.keluhan}, ${existingPasien.keluhan}`;
    } else {
      updatedKeluhan = addPasien.keluhan;
    }

    const pasien = await prisma.pasien.upsert({
      where: {
        nama_gender_alamat: {
          nama: addPasien.nama,
          gender: addPasien.gender,
          alamat: addPasien.alamat,
        },
      },
      update: {
        kunjungan: {
          increment: 1,
        },
        keluhan: {
          set: updatedKeluhan,
        },
      },
      create: {
        nama: addPasien.nama,
        keluhan: addPasien.keluhan,
        kunjungan: 1,
        alamat: addPasien.alamat,
        gender: addPasien.gender,
      },
    });

    res.send({
      data: pasien,
      message: "Berhasil",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Gagal melakukan upsert",
      error: error.message,
    });
  }
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
