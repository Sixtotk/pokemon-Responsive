const  axios  = require("axios");
const { Types } = require("../../db.js");

async function getTypes(){
  let DbTypes = await Types.findAll().catch(e => undefined)
  if(!DbTypes.length){
    const types = await axios.get("https://pokeapi.co/api/v2/type").catch(e=>{
    return {message:'No logro acceder a la API'}});
    const typesData= types.data.results.map(e => e.name);
    for(let i = 0; i < typesData.length; i++){
      await Types.create({ name: typesData[i] })
    }
    DbTypes = await Types.findAll();                 
      return DbTypes;
    }
  return(DbTypes)   
    }
module.exports = { getTypes }
  