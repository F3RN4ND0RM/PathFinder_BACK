import Abilities from "../models/abilities.model.js"


//Endpoint to get abilities
//return {error: "Something went wrong"} if error
//return abilities if ok
export const getAbilities = async(req, res) =>{
    try{
        const abilities = await Abilities.findAll()

        if(abilities.length  > 0)    
            return res.status(200).json(abilities)

        return res.status(400).json({error: "Something went wrong"})
    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}