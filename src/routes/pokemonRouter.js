const { Router } = require("express");
const router = Router();
const { Pokemon, Type } = require("../db");
const {
  getPokemons,
  getAllPokemons,
  getDBPokemons,
  getPokemonsById,
  getPokemonsDbById,
  getPokemonsName,
  getPokemonsNameDb,
} = require("../controllers/pokemon");

router.get("/", async (req, res) => {
  try {
    // hacemos nuestra ruta get para buscar por nombre.
    const { name } = req.query;
    if (name) {
      let pokemons = [];
      // buscamos en la Api externa.
      const pokemonsapi = await getPokemonsName(name);
      if (pokemonsapi) {
        // si lo encuentra que lo mande en el array que creamos
        pokemons.push(pokemonsapi);
      }
      // si no estan en la Api lo buscamos en DB.
      const pokemonsDb = await getPokemonsNameDb(name);
      if (pokemonsDb) {
        // si lo encuentra que lo mande en el array que creamos
        pokemons.push(pokemonsDb);
      }
      if (pokemons.length === 0) {
        return res.status(404).send("Pokemon not found");
      }
      const foundPokemon = pokemons.find((pokemon) => pokemon.name === name);
      if (!foundPokemon) {
        return res.status(404).send("Pokemon not found");
      }

      // si encontramos el pokemon enviamos la respuesta.
      return res.status(200).json(pokemons);
    }
    // si no se busca por el nombre devolvemos todos los pokemones.
    const pokemonsAll = await getAllPokemons();
    return res.status(200).json(pokemonsAll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:idPokemon", async (req, res) => {
  try {
    // se destructura el id por params.
    const { idPokemon } = req.params;
    // si tiene valor el id, inicializamos nuestra variable en null para buscar el pokemon.
    if (idPokemon) {
      let searchId = null;
      // se valida si el id no un es numero para buscarlo en la DB.
      if (isNaN(idPokemon)) {
        searchId = await getPokemonsDbById(idPokemon);
      } else {
        // si es numero lo buscamos en la api externa
        searchId = await getPokemonsById(idPokemon);
      }
      if (searchId) {
        // si tenemos un valor quiere decir que encontramos el pokemon y enviamos la respuesta.
        return res.status(200).json(searchId);
      }
    }
    // si el id no tiene valor devolvemos le mensaje.
    return res.status(404).send("Pokemon not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      id,
      name,
      image,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
      createInDb,
    } = req.body;
    // se verifica que el nombre este disponible en la api.
    let searchName = await getPokemonsName(name);
    if (!searchName) {
      // si no esta en la api validamos en la DB
      searchName = await getPokemonsNameDb(name);
      if (searchName) {
        // si existe devolvemos una respuesta que existe y no se puede crear con ese nombre.
        return res.status(404).send("The Pokemon already exists");
      }
    }
    // si no existe lo creamos en nuestra DB
    let pokemonCreated = await Pokemon.create({
      id,
      name,
      image,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      createInDb,
    });
    let typeDB = await Type.findAll({
      where: { name: types },
    });
    pokemonCreated.addType(typeDB);
    return res.status(200).json(pokemonCreated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:idPokemon", async (req, res) => {
  try {
    const { idPokemon } = req.params;
    let deletePokemons = await Pokemon.findByPk(idPokemon);
    deletePokemons.destroy();
    res.status(200).send("Pokemon delete correctly");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
