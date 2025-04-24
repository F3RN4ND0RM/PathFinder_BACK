import { validationResult } from 'express-validator'

//Middleware to validate fields on body petitions:
export const expirationValidation = async (req , res, next  ) => {
    const dateBody = req.body.expiration
    const date = new Date(dateBody)
    console.log(date)

    //If error return error
    if(date == 'Invalid Date'){
        return res.status(400).json({error : "invalid expiration"})
    }

    //Else next
    next()
}

