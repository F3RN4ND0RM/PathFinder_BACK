
import Certifications from "../models/certifications.model.js"

/*
Gets all certificacions on db
returns: certifications[]
*/
export const getCertifications = async (req, res) =>{
    try{
        const certifications = await Certifications.findAll()
        return res.status(200).json(certifications)
    }catch(error){
        console.log(error)
        return res.status(400).json({error : error})
    }
}