//const  axios  = require("axios");
const { Router } = require("express");
//const {Pokemon, Types} = require("../db");
const {
    getPokemonsInApi,
    getPokemonsInDb,
    getPokemonsInApibyName,
    getPokemonsDbByName,
    getPokemonsInApibyId,
    getPokemonsDbById,
    createPokemon
  } = require("./controllers/pokemons.js")

const router = Router();

router.get("/", async(req,res) => {
    const { name } = req.query;
      try{
        if(name){ 
          nameLower = name.toLowerCase();//convierto en minuscula
          const pokemonApiname = await getPokemonsInApibyName(nameLower)//uso api
          if(!pokemonApiname){// si no encuentra
          const pokeDb = await getPokemonsDbByName(nameLower)// uso Db
            if(!pokeDb){// si no encuentra
              res.json({ error: "Pokemon no encontrado!" });// no encontrado
            }else return res.json(pokeDb);//si encuentra en Db muestra
          }else return  res.json(pokemonApiname)// si encuentra en api muestra
        }
        if(!name){
          const pokesInApi = await getPokemonsInApi();//si no hay query busca en getpokemonsinapi
          const pokesDB = await getPokemonsInDb();// tambien los de la DB
          const allpokes = pokesInApi.concat(pokesDB);//concateno todo
          return res.json(allpokes)//retorna allpokes y muesta todas los pokemons
        }
      }
      catch(e){
        console.log(e)
        return res.status(410).send(e)
      }
    }
);
  
  router.get("/:pokemonId", async(req,res) => {
    const { pokemonId } = req.params;
      try{
        if(pokemonId){ 
          const pokemonApiId = await getPokemonsInApibyId(pokemonId)
          if(!pokemonApiId){
            const pokeDbId = await getPokemonsDbById(pokemonId)
            if(!pokeDbId){
              res.json({ error: "Pokemon no encontrado!" })
            }else return res.send(pokeDbId)
          }else return  res.send(pokemonApiId)
        }  
      }
      catch(e){
        console.log(e)
        return res.status(410).send(e)
      }
    }
  );

  router.post("/", async(req,res) => {
    const { id,name,types, hp, attack, defense, speed, height, weight, image} = req.body;
    const pokemon = await createPokemon(
      id,
      name,
      types,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      image
      );
    res.json(pokemon);
  });
  

module.exports = router;