import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Employees from   '../models/employees.model.js'
import crypto from 'crypto';
import {sendOTP, sendNotification} from  './email.controller.js'
import {Employees as Emp ,Abilities as Abs, Courses, Roles, Projects, Levels, Certifications} from '../models/associations.js';

/* getEmployeeCertifications
    return list of certifications that employee worked on if ok
    Returns { "msg" : "Ability Added"} if ok
    Returns {error :  "Employee has not registered courses"} if not ok
*/

export const getEmployeeCertifications = async(req, res) =>{
    const employeeId = req.employeeId;
    
    try{
        const roles = await Emp.findByPk(employeeId,{
            attributes : [],
            include : {
                model : Certifications,  
                attributes : ['id', 'name', 'description'],
                as:'certificationsOfEmployee',            
                through : {
                    attributes : ['expiration', 'createdAt', 'updatedAt']
                }    
            }
        })

        return roles
            ? res.status(200).json(roles)
            : res.status(404).json({error :  "Employee has not registered Certifications"})

    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}



/* getEmployeeProject
    return list of projects that employee worked on if ok
    Returns {error :  "Employee has not registered courses"} if not ok
*/
export const getEmployeeProject = async(req, res) =>{
    const employeeId = req.employeeId;
    
    try{
        const roles = await Emp.findByPk(employeeId,{
            attributes : [],
            include : {
                model : Roles,
                attributes : ['id', 'name', 'description'],
                as:'rolesOfEmployee', 
                through : {
                    attributes : ['status', 'createdAt', 'updatedAt']
                },
                
                include : {
                    model : Projects,
                    attributes : ['deliveryLeader', 'name', 'status']                                        
                }

            }
        })

        return roles
            ? res.status(200).json(roles)
            : res.status(404).json({error :  "Employee has not registered Projects"})

    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}



 /* employeesCourses
    return list of courses that employee is subscribed if ok
    Returns {error :  "Employee has not registered courses"} if not ok
*/
export const getEmployeeCourses = async(req, res) =>{
    const employeeId = req.employeeId;
    
    try{
        const courses = await Emp.findByPk(employeeId,{
            attributes : [],
            include : {
                model : Courses,
                as:'coursesOfEmployee', 
                attributes : ['id','name', 'description', 'imgUrl'],
                through :{
                    attributes :['status', 'favstatus','createdAt', 'updatedAt'],
                } 
            }
        })

        return courses
            ? res.status(200).json(courses)
            : res.status(404).json({error :  "Employee has not registered courses"})

    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}



 /* Adds ability to employee    
    Returns { "msg" : "Ability Added"} if ok
*/
export const addAbilities = async(req, res) =>{
    const employeeId = req.employeeId
    const abilityId = req.body.abilityId
    try{
        await Absinfo.create({
            idemployee: employeeId,
            idabs:  abilityId
        })
        return res.status(200).json({msg : "Ability Added"})
    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}


 /* Get Employee info
    Returns {error: "Auth Failed"} if employee doesnt exists
    Returns { "name": "name", "rolename": "rolename", "email": "email","percentage": "percentage"} if ok
*/
export const getEmployeeInfo = async(req,res)=>{
    //Retrieves employee ID
    const employeeId = req.employeeId
    try{

        const employee = await Emp.findByPk(employeeId, {            
            attributes : ['name', 'rolename', 'email', 'percentage'     ],
            include : [{
                 model: Abs,
                as: 'abilitiesOfEmployee',      
                attributes : ['name','id'],
                through : {
                    attributes : ['createdAt']
                }
            }]
        })

        //if employee return values
        return employee
            ? res.status(200).json(employee)
            : res.status(400).json({error: "Auth Failed"})
        
    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}




 /* Update Employee info
    Returns {error: "Auth Failed"} if employee doesnt exists
    Returns { "name": "name", "rolename": "rolename", "email": "email","percentage": "percentage"} if ok
*/
export const updateEmployeeInfo = async(req, res) =>{
    const employeeId = req.employeeId
    const {name, email, pass} = req.body    
    try{

        const employee = await Emp.findByPk(employeeId, {
        })

        if(!employee)
            return res.status(400).json({error :  "Auth Failed"})

        const oldEmail = employee.email
        const oldName = employee.name
        
        const isValid = await bcrypt.compare(pass || "", employee.pass)                
        if(!isValid)            
            return  res.status(400).json({error : "Failed Auth"})
                
        await Employees.update({
            name : name,
            email : email
        },{
            where :{
                id : employeeId
            }
        })


        const message = `
            You had update your information.
            <br><br>
            <tr>
                <td>
                    <strong>Old</strong>
                </td>
                <td>
                    <strong>New</strong>
                </td>
            </tr>
            <tr>
                <td>
                    ${oldEmail}
                </td>
                <td>
                    ${email}
                </td>
            </tr>
            <tr>
                <td>
                    ${oldName}
                </td>
                <td>
                    ${name}
                </td>
            </tr>
        `
        sendNotification(employee.email, "Your Info had change", message,employee.name)

        return res.status(200).json({msg: "Employee info updated"})
    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
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


        const employee = await Emp.findOne({
            where: {email : email},
            include :  {
                model : Levels,
                attributes : ['id', 'name']
            }
        })

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
        return res.status(200).json({status : "true", token : jwtoken, level : employee.Level})                    

    }catch(error){
        console.error(error)
        return res.status(400).json({error : error})
    }
}