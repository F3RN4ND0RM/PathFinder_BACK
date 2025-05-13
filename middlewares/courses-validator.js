
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import Certification from '../models/certifications.model.js'
import Courses from '../models/courses.model.js';



//Middleware to validate Courses
//Returns  {error: "course not valid"} if Course is not registered
//Continues if course is confirmed
export const validatesCourse = async (req, res, next) => {
    //Retrieves token from header
    const courseId = req.body.courseId
    
    try{
        //If theres abilitie          
        const course = await Courses.findByPk(courseId)
        
        if(!course)
            return res.status(400).json({error: "course not valid"})
        next()

    }catch(error){
        console.log(error)
       return res.status(400).json({error: "Something went wrong"})
    }
}
