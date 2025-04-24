
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import Certification from '../models/certifications.model.js'



//Middleware to validate Certifications
//Returns  {error: "user not authenticated"} if Abilities is not registered
//Continues if Certification is confirmed an user existes
export const validatesCertifications = async (req, res, next) => {
    //Retrieves token from header
    const certificationId = req.body.certificationId
    
    try{
        //If theres abilitie          
        const certification = await Certification.findByPk(certificationId)
        
        if(!certification)
            return res.status(400).json({error: "certification not valid"})
        next()

    }catch(error){
        console.log(error)
       return res.status(400).json({error: "Something went wrong"})
    }
}
