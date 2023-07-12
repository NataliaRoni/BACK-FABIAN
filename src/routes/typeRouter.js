const { Router } = require("express");
const router = Router();
const { Type } = require("../db");
const axios = require("axios");
const URL = "https://pokeapi.co/api/v2/type";

router.get("/", async (req, res) => {
  try {
    //verifico si hay tipos de pokemon
    const listTypes = await Type.findAll();
    if (listTypes.length === 0) {
      // Solicitud api de los types de Pokemons
      const typeApi = await axios.get(URL);
      const listTypes = typeApi.data.results.map((ty) => {
        return { name: ty.name };
      });
      // se utiliza este metodo de sequelize para insertar todos los nombres de los tipos de pokemons.
      await Type.bulkCreate(listTypes);
      return res.status(200).json(listTypes); // retornamos los tipos
    } else {
      return res.status(200).json(listTypes);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
