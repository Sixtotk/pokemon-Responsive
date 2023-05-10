const { Router } = require("express");
const { getTypes } = require("./controllers/types.js")
const router = Router();

router.get("/", async (req, res) => {
    try{
        const type = await getTypes()
    return res.send(type)
    }catch(e){
        console.log(e)
    }
})

module.exports = router;