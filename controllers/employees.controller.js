import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Employees from   '../models/employees.model.js'
import crypto from 'crypto';
import { Op } from 'sequelize';
import {sendOTP, sendNotification} from  './email.controller.js'
import {Employees as Emp ,Abilities as Abs, Courses, Roles, Projects, Levels, Certifications, Goals, Feedback} from '../models/associations.js';
import Certinfo from '../models/certinfo.model.js';
import Absinfo from '../models/absinfo.model.js';
import Courseinfo from '../models/courseinfo.model.js';




/*  get employees timeline
    Returns { "msg" : "goals updated"} if ok*/
export const getEmployeeTimeline = async(req, res) =>{
    const employeeId = req.employeeId
    try{

        const timeline = await Emp.findByPk(employeeId, {
            attributes : [],
            include: [{
                model : Courses,
                attributes : ["name"],                
                through : {
                    attributes : ['updatedAt', "status"]
                },
                as : 'coursesOfEmployee'
            }, {
                model : Roles,
                as : 'rolesOfEmployee',
                attributes : ["name"],
                through : {
                    attributes : ["createdAt"]
                }
            }],


        })
        return  res.status(200).json(timeline)

    }catch(error){
        console.log(error)
        return res.status(400).json({error: "Something went wrong"})
    }

}

 /* get Employees (staffs)
    Returns { "msg" : "goals updated"} if ok
*/
export const getEmployeesStaff = async(req, res) =>{
    try{
        const staff = await Emp.findAll({
            attributes : ['id','name', 'email', 'capability', 'rolename', 'idlevel', "staff"],
            where : {staff : false},
            include : [{
                model: Abs,
                as: 'abilitiesOfEmployee',      
                attributes : ['name','id'],
                through : {
                    attributes : []
                }
            }, 
            {
                model : Roles,
                attributes : ['id', 'name', 'description'],
                as:'rolesOfEmployee', 

                through : {
                    attributes : ['status', 'createdAt', 'updatedAt'],                
                },
                include :{
                    model : Projects,
                    attributes : ['name', 'status'],
                    where :  {
                        status : true
                    }                                  
                },
 

                
                
            },{
                model : Certifications,
                as : 'certificationsOfEmployee'
            }]})

        return res.status(200).json({staff})

    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}


 /* updates goals of employee    
    Returns { "msg" : "goals updated"} if ok
*/
export const updateGoals =  async(req, res) =>{
    const employeeId = req.employeeId
    const technologies = req.body.technologies
    const goal = req.body.goals
    const project = req.body.project

    try{
        let goals = await Goals.findOne({where : {idEmployee : employeeId}})
        
        if(goals){
            await goals.update({goals : goal, project : project, technologies : technologies})
            return res.status(200).json({msg : "Goals updated"})
        }
            
        await Goals.create({goal : goal, project : project, technologies : technologies})
        return res.status(200).json({msg : "Goals created"})

    }catch(error){
        console.log(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}

 /* Adds course to employee    
    Returns { "msg" : "Ability Added"} if ok
*/
export const addCourse = async (req, res) =>{
    const employeeId = req.employeeId
    const courseId = req.body.courseId
    const favstatus  = req.body.favstatus    
    try{

        const courseinfo = await Courseinfo.findOne({where : {[Op.and] : [{idEmployee : employeeId}, { idCourse : courseId}]}})

        if(courseinfo){            
            await courseinfo.update({
                favstatus : favstatus
            })
            return res.status(200).json({msg : `course ${courseinfo.favstatus ? 'liked' : 'disliked'}`})
        }
            
         await Courseinfo.create({
            idEmployee : employeeId,
            idCourse :  courseId,
            favstatus : favstatus
        })

        return res.status(200).json({msg : "course Added"})
        
    }catch(error){
        console.log(error)
        return res.status(400).json({error: "Something went wrong"})
    }
    
}

 /* Adds ability to employee    
    Returns { "msg" : "Ability Added"} if ok
*/
export const addCertifications = async(req, res) =>{
    const employeeId = req.employeeId
    const certificationId = req.body.certificationId
    const expiration = req.body.expiration
    const today = new Date()
    let currentExpiration = new Date()
    try{

        let certinfo = await Certinfo.findOne({where : {
                [Op.and] : [{idEmployee : employeeId}, {idCert : certificationId}],
            },
             order : [['createdAt', 'DESC']]
        })

        if(certinfo)
            currentExpiration = new Date(certinfo.expiration)            

        if(currentExpiration > today)
            return res.status(400).json({msg :  "this certifications is currently valid"})

        
        await Certinfo.create({
            idEmployee: employeeId,
            idCert:  certificationId,
            expiration : expiration,
        })

        return res.status(200).json({msg : "certification Added"})
                
        

    }catch(error){
        console.error(error)
        return res.status(400).json({error: "Something went wrong"})
    }
}


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
    const status = req.query.status || true
    
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
                    attributes : ['name', 'status'],
                    where :  {
                        status : status
                    }                                  
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
        
        const absinfo = await Absinfo.findOne({
            where : {[Op.and] : [{idemployee :  employeeId}, {idabs : abilityId}]}
        })
        

        if(absinfo)
            return res.status(400).json({msg:  "Ability already added"})

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
            },{
                model : Goals,    
                attributes : ['technologies', 'project', 'goals']           
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