import {Courses, Employees,} from "../models/associations.js"


/* gets all courses 
    Returns { courses } if ok
*/
export const getCourses = async(req, res) =>{
    const employeeId = req.employeeId
    try{
        const courses = await Courses.findAll({
            include : {
                model : Employees,
                as : "employeesByCourse",
                attributes : ['id'],
                where : {id :employeeId },
                required: false,
                through : {
                    attributes : ['status', 'favstatus', 'createdAt', 'updatedAt'],                    
                }

            }
        })

        if(courses.length > 0)
            return res.status(200).json(courses)
        

        return res.status(204).json({error : "Something Went Wron"})
       }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}