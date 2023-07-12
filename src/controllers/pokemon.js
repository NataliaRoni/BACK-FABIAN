const axios = require("axios");
const { Pokemon, Type } = require("../db");
const URL = "https://pokeapi.co/api/v2/pokemon";
const limit = 149;
async function getPokemons() {
  let pokemonsArr = [];

  try {
    // Solicitud a la Api
    const response = await axios.get(`${URL}?limit=${limit}`);
    const resultsPromises = response.data.results.map((inf) =>
      axios.get(inf.url)
    );
    // aca esperamos que todas las promesas se resuelvan y nos devuelve el array con la informacion de los pokemon
    const pokemons = await Promise.all(resultsPromises);
    // a nuestro array de pokemons lo mapeamos y solo le vamos a solicitar datos especificos.
    pokemonsArr = pokemons.map((pok) => ({
      id: pok.data.id,
      name: pok.data.name,
      image: pok.data.sprites.other.dream_world.front_default,
      hp: pok.data.stats[0].base_stat,
      attack: pok.data.stats[1].base_stat,
      defense: pok.data.stats[2].base_stat,
      speed: pok.data.stats[3].base_stat,
      height: pok.data.height,
      weight: pok.data.weight,
      types: pok.data.types.map((ty) => ({ name: ty.type.name })),
    }));

    return pokemonsArr;
  } catch (error) {
    return error;
  }
}

// Funcion para traer  la informacion de la base de datos
async function getDBPokemons() {
  // utilizamos el metodo de sequelize para traer los pokemons y inculir el modelo Type a nuestros pokemon
  return await Pokemon.findAll({
    include: {
      model: Type,
      attributes: ["name"],
      through: {
        // es necesrio para indicarle que quieres traer los atributos
        attributes: [],
      },
    },
  });
}
// funcion para juntar toda la informacion
async function getAllPokemons() {
  try {
    let apiPokemons = await getPokemons();
    let dbPokemons = await getDBPokemons();
    return apiPokemons.concat(dbPokemons);
  } catch (error) {
    return error;
  }
}
// ----------------------------------------------------------------//
// busqueda por id
async function getPokemonsById(id) {
  try {
    // Solicitud a la Api
    const searchId = await axios.get(`${URL}/${id}`);
    // si el id solicitado existe que nos devuelva los datos especificos.
    if (searchId) {
      return {
        id: searchId.data.id,
        name: searchId.data.name,
        image: searchId.data.sprites.other.dream_world.front_default,
        hp: searchId.data.stats[0].base_stat,
        attack: searchId.data.stats[1].base_stat,
        defense: searchId.data.stats[2].base_stat,
        speed: searchId.data.stats[3].base_stat,
        height: searchId.data.height,
        weight: searchId.data.weight,
        types: searchId.data.types.map((ty) => {
          return {
            name: ty.type.name,
          };
        }),
      };
    } else {
      // si no existe el id que nos retorne Null
      return null;
    }
  } catch (error) {
    return error;
  }
}
// funcion para obtener la informacion por id en DB
async function getPokemonsDbById(id) {
  try {
    // se utiliza el metodo de sequelize para buscar el primer registro del pokemon y le incluimos el modelo Type
    const searchDBId = await Pokemon.findOne({
      where: {
        id: id,
      },
      include: {
        attributes: ["name"],
        model: Type,
      },
    });
    return searchDBId;
  } catch (error) {
    return error;
  }
}

//-------------------------------------------------------------------//
//Busqueda por name

async function getPokemonsName(name) {
  try {
    // Solicitud a la Api
    const searchName = await axios.get(`${URL}/${name.toLowerCase()}`);
    //si el name solicitado existe que nos devuelva los datos especificos.
    if (searchName) {
      return {
        id: searchName.data.id,
        name: searchName.data.name,
        image: searchName.data.sprites.other.dream_world.front_default,
        hp: searchName.data.stats[0].base_stat,
        attack: searchName.data.stats[1].base_stat,
        defense: searchName.data.stats[2].base_stat,
        speed: searchName.data.stats[3].base_stat,
        height: searchName.data.height,
        weight: searchName.data.weight,
        types: searchName.data.types.map((ty) => {
          return {
            name: ty.type.name,
          };
        }),
      };
    } else {
      // si no existe el name que nos retorne Null
      return null;
    }
  } catch (error) {
    return error;
  }
}

// funcion para obtener informacion por name en la DB

async function getPokemonsNameDb(name) {
  // se utiliza el metodo de sequelize para buscar el primer registro del pokemon y le incluimos el modelo Type
  try {
    const searchDB = await Pokemon.findOne({
      where: {
        name: name,
      },
      include: {
        model: Type,
        attributes: ["name"],
      },
    });
    return searchDB;
  } catch (error) {
    return error;
  }
}
module.exports = {
  getPokemons,
  getAllPokemons,
  getDBPokemons,
  getPokemonsById,
  getPokemonsDbById,
  getPokemonsName,
  getPokemonsNameDb,
};
