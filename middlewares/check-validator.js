import { validationResult } from 'express-validator'

//Middleware to validate fields on body petitions:
export const checkValidator = async (req , res, next  ) => {

    //Finding errors
    const  errors = validationResult(req)

    //If error return error
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }

    
    //Else next
    next()
}
