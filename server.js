import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import bodyParser from "body-parser";
//import bcrypt from "bcrypt";
import dontenv from "dotenv";
import { fileURLToPath } from "url";
dontenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = path.join(__dirname, "db.json");
app.post("/add", async (req, res) => {
  try {
    const newData = {
      nom: req.body.nom,
      email: req.body.email,
      age: req.body.age,
    };
    const oldData = await LoadData();
    oldData.push(newData);
    await SaveData(oldData);

    //console.log(req.body);

    res.status(200).json("sauvegarde avec succes");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
app.get("/get", async (req, res) => {
  try {
    const data = await LoadData();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
app.get("/", (req, res) => {
  res.status(200).json("Hello World");
});
app.listen(port, () => {
  console.log(`le server est lancé sur le port ${port} `);
});

let LoadData = async () => {
  try {
    const data = await fs.readFile(db, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return [];
  }
};

let SaveData = async (data) => {
  try {
    await fs.writeFile(db, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
  }
};
