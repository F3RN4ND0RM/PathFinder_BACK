
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import Abilities from '../models/abilities.model.js';
dotenv.config()


//Middleware to validate Abilities
//Returns  {error: "user not authenticated"} if Abilities is not registered
//Continues if Avilities is confirmed an duser existe
export const validatesAbilities = async (req, res, next) => {
    //Retrieves token from header
    const abilityId = req.body.abilityId
    
    try{
        //If theres abilitie          
        const abilitie = await Abilities.findByPk(abilityId)
        
        if(!abilitie)
            return res.status(400).json({error: "Ability not valid"})

        //Append abilitY id  to body
        req.body.abilityId = abilityId
        next()

    }catch(error){
        console.log(error)
       return res.status(400).json({error: "Something went wrong"})
    }
}
