import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Employees from   '../models/employees.model.js'
import crypto from 'crypto';
import {sendOTP} from  './email.controller.js'



export const updateEmployee = async(req, res) =>{
    try{

    }catch(error){
        console.error(error)
        return res.status(400).json({error : error})
    }
}


//signup function
//returns {msg : "Employee password setted"} if everything ok
//returns {error: "Failed Auth"} if otp is incorrect or email is not registered
export const signUp = async(req, res) => {
    const pass = req.body.pass
    const email = req.body.email
    const otp = req.body.otp

    try{
        
        const employee = await Employees.findOne({where: {email : email}})

        if(!employee || employee.otp != otp)
            return  res.status(400).json({error : "Failed Auth"})    

        //Salting ad Hashing password 
        const salt = await bcrypt.genSalt(10)        
        const secured_pass =  await bcrypt.hash(pass, salt)

        //updating password and otp setted to null
        await employee.update({pass : secured_pass, otp : null})
        
        return res.status(200).json({msg : "Employee password setted"})


    }catch(error){
        console.error(error)
        return res.status(400).json({error : error})
    }
}



//Login function
//returns jwt if password setted
//returns false if password unsetted
export const logIn = async(req, res) =>{    
    try{
        //Retrive email form body
        const email = req.body.email
        const pass = req.body.pass || ""


        const employee = await Employees.findOne({where: {email : email}})

        //Email is not registered
        if(!employee)   
            return  res.status(400).json({error : "Failed Auth"})    

        //Employee has not setted password
        if(employee.pass == null){
            
            //Creating OTP
            const otp = crypto.randomInt(100000, 999999);
            //Saving OTP on db
            await employee.update({otp : otp})  
            //Sending OTP by email
            sendOTP(employee.email, employee.otp, employee.name)
            return res.status(200).json({status : "false"})
        }            
        
        //Validating encripted password 
        
        
        const isValid = await bcrypt.compare(pass || "", employee.pass)        
        if (!isValid)            
            return  res.status(400).json({error : "Failed Auth"})

        //creating JSON WEB TOken
        const jwtoken = jwt.sign({
            id : employee.id,}
            ,String(process.env.SECRET)
            ,{ expiresIn: "86400000" })

        //Login ok
        return res.status(200).json({status : "true", token : jwtoken})                    

    }catch(error){
        console.error(error)
        return res.status(400).json({error : error})
    }
}