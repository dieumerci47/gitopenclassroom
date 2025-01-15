import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import bodyParser from "body-parser";
//import bcrypt from "bcrypt";
import dontenv from "dotenv";
import { fileURLToPath } from "url";
dontenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const corsOptions = {
  origin: "*", // Permet toutes les origines
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
//Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const db = path.join(__dirname, "db.json");
app.post("/add", async (req, res) => {
  try {
    const NewId = await LoadData();
    const ids = await NewId.map((id) => {
      return id.id;
    });
    let checkId = 1;
    for (let i = 0; i < NewId.length; i++) {
      if (ids.includes(checkId)) {
        checkId++;
      }
    }
    const newData = {
      nom: req.body.nom,
      email: req.body.email,
      age: req.body.age,
      id: checkId,
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
app.delete("/del/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await LoadData();
    for (let i = 0; i < data.length; i++) {
      /*       console.log(data[i].id);
      console.log(id);
 */
      if (data[i].id == id) {
        const newData = await data.filter((index) => {
          return index.id != id;
        });
        await SaveData(newData);
      }
    }
    res.status(200).json("deletes");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "index.html"));
  res.status(200).json("Ok");
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
