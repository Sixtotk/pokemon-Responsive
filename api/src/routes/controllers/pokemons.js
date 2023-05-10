const  axios  = require("axios");
const {Pokemon, Types} = require("../../db.js");


async function getPokemonsInApi(){
    try{
      const pokeapi = await axios("https://pokeapi.co/api/v2/pokemon?limit=40");
      const pokeUrls = pokeapi.data.results.map(pokemon => axios(pokemon.url));
      let pokemons = Promise.all(pokeUrls)
      .then(pokemons => {
        let pokemonFullData = pokemons.map(r=> r.data)
        let pokemon = pokemonFullData.map(r => {
          return{
            id: r.id,
            name: r.name,
            types: r.types.map(e=>e.type.name),
            image: r.sprites.other.home.front_default
          }   
        })
        return pokemon;
      })
      return pokemons
    }
    catch(e){
      console.log(e)
    }
  }

  async function getPokemonsInDb(){
    try{
      const pokemonDb = await Pokemon.findAll({
        include: {
          model: Types,
          through: {
            attributes: [],
          },
        },
        attributes: ["id", "name", "image", "attack"],
      });
    return pokemonDb.map((e) => ({
      id: e.id,
      name: e.name,
      image: e.image,
      types: e.types.map((e) => e.name),
    }));
    }
    catch(e){
      console.log(e)
    }
  }
    
  async function getPokemonsInApibyName(name){
    try{
      const pokeprueba = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pokeFull = pokeprueba.data;
      const pokeName = pokeFull.name
      return [{
        id: pokeFull.id,
        name: pokeFull.name,
        image: pokeFull.sprites.other.home.front_default,
        types: pokeFull.types.map(e => e.type.name) 
      }]
    }catch(e){
        console.log(e)
    }
  }
  
  async function getPokemonsDbByName(name){
    try{
      const PokeDbName = await Pokemon.findAll({
        where: {
          name,
        },
        include: {
          model: Types,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
        attributes: ["id", "name", "attack", "image"],
      });
      const arr = PokeDbName.map((e) => ({
        id: e.id,
        name: e.name,
        image: e.image,
        types: e.types.map((e) => e.name),
      }));
      return arr[0]
    }
    catch(e){
      console.log(e)
    }
  }
  
  
    // async function b(){
    //   var b = await getPokemonsDbByName("mendoza")
    //   console.log(b)
    // }
    // b()
  
  
  async function getPokemonsInApibyId(id){
    try{
      const pokeid = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokeFull = pokeid.data;  
      return{
        id: pokeFull.id,
        name: pokeFull.name,
        image: pokeFull.sprites.other.home.front_default,
        types: pokeFull.types.map(e => e.type.name),
        hp: pokeFull.stats[0].base_stat,
        attack: pokeFull.stats[1].base_stat,
        defense: pokeFull.stats[2].base_stat,
        speed: pokeFull.stats[5].base_stat,
        height: pokeFull.height,
        weight: pokeFull.weight,
      }
    }
    catch(e){
      console.log(e)
    }
  }  
  
  async function getPokemonsDbById(id){
    const pokeDbId = await Pokemon.findByPk(id, {
    include: {
      model: Types,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  return {
    id: pokeDbId.id,
    image: pokeDbId.image,
    name: pokeDbId.name,
    types: pokeDbId.types.map((e) => e.name),
    hp: pokeDbId.hp,
    attack: pokeDbId.attack,
    defense: pokeDbId.defense,
    speed: pokeDbId.speed,
    height: pokeDbId.height,
    weight: pokeDbId.weight,
  };
  }

   
  
            
            
  async function createPokemon(id,name,types,hp,attack,defense,speed,height,weight,image){
    if (!image) image = "https://i.imgur.com/G4WCJsE.png";
    const pokemon = await Pokemon.create({
      id,
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      image
    });
    const typeDb = await Types.findAll({
      where: {
        name: types,
      },
    });
    console.log(typeDb)
    pokemon.addType(typeDb);
    pokemon.dataValues.types = typeDb.map(e => e.dataValues.name)
    return pokemon;
  }   

   // async function b(){
    //   var b = await getPokemonsDbById("45")
    //   console.log(b)
    // }
    // b()

    module.exports  = {
        getPokemonsInApi,
        getPokemonsInDb,
        getPokemonsInApibyName,
        getPokemonsDbByName,
        getPokemonsInApibyId,
        getPokemonsDbById,
        createPokemon
    }