import { Op } from 'sequelize'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import Employees from '../models/employees.model.js';
dotenv.config()


//Middleware to validate at least level 2 
//Continues if at least lvl 2
export const validatesLvl2 = async (req, res, next) => {
    //Retrieves id from request
    const employeeId = req.employeeId
    
    try{

        const employee = await Employees.findByPk(employeeId)
        //If employee
        if(employee.idlevel  < 2)      
            return res.status(400).json({error: "User unauthorized"})                                

        next()

    }catch(error){
        console.log(error)
       return res.status(400).json({error: "Something went wrong"})
    }
}
