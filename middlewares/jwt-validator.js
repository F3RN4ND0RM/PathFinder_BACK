import { Op } from 'sequelize'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import Employees from '../models/employees.model.js';
dotenv.config()


//Middleware to validate JWT 
//Returns  {error: "user not authenticated"} if JWT is not valid
//Continues if JWT is confirmed an duser existe
export const validatesJWT = async (req, res, next) => {
    //Retrieves token from header
    const token =await req.get("token")
    let employeeId = 0
    

    try{

        //If theres token         
        if(token){
            //Verify it 
                     
            await jwt.verify(token,String(process.env.SECRET), (err, employeeToken) => {                
                //updates employee id
                if(!err)
                    employeeId = employeeToken.id                
            })
        }         

      
        
        if(employeeId == 0)
            return res.status(400).json({error: "User not authenticated"})

        //Append employee  to body
        req.employeeId = employeeId
        
        next()

    }catch(error){
        console.log(error)
       return res.status(400).json({error: "Something went wrong"})
    }
}
