import Projects from "../models/projects.model.js";
import sequelize from "../db/db.js";
import Assigned from "../models/assigned.model.js";
import {Courses, Courseinfo, Employees, Roles} from "../models/associations.js"
import { Op } from "sequelize";


export const getData = async(req, res) =>{
    try{
        const transaction = await sequelize.transaction();

        let projects = await Projects.findAll(
            {
                attributes : ['status',
                    [sequelize.fn('COUNT', sequelize.col(`id`)), 'count'],                    
                ],
                group: ['status'],
                transaction
            }
            
        )

        const totalProjects = projects.reduce((sum, item) => sum + Number(item.dataValues.count),0 )        
        projects = projects.map(item =>{ return {...item.dataValues, promedio : Number((Number(item.dataValues.count) * 100 /totalProjects ).toFixed(2))  }} )
        

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyAssigned = await Assigned.count({
            attributes: [
                [sequelize.fn('EXTRACT', sequelize.literal(`MONTH FROM "updatedAt"`)), 'month'],
                [sequelize.fn('EXTRACT', sequelize.literal(`YEAR FROM "updatedAt"`)), 'year']
            ],
            where: {
                updatedAt: { [Op.gt]: sixMonthsAgo }
            },
            group: ['month', 'year'],
            transaction
        });

        const popularCourses = await Courseinfo.findAll({
            attributes : ['idCourse', [sequelize.fn('COUNT', sequelize.col(`idCourse`)), 'count_course'],],
            group : ['idCourse', "Course.id"],
            order : [['count_course','DESC']],
            include : {
                attributes : [ 'name'],
                model : Courses,
            },
            limit : 10,
            transaction
        })

        let totalEmployees = await Employees.findAndCountAll()
        totalEmployees= totalEmployees.count
        let assignedEmployess = await Employees.findAll({
            attributes :['id'],
            include : {
                model : Roles,
                as: 'rolesOfEmployee',
                attributes :[],
                through : {
                    where : {
                        "status" : true
                    }
                },         
                required: false,
                right: true 
            }
        })
        let count = assignedEmployess.reduce((sum, item) => sum+1,0)

     
        const assignedPercentage = {Total: count,percentage:  Number(((count * 100) / totalEmployees).toFixed(2))}
        const unassignedPercentage = {Total : totalEmployees-count, percentage: Number(((totalEmployees-count) * 100 / totalEmployees).toFixed(2))}

        await transaction.commit();


        return res.status(200).json({
            Projects: projects,
            monthlyAssigned : monthlyAssigned,
            coursesByPopularity : popularCourses,            
            Assigned : {
                totalEmployees: totalEmployees,
                assignedPercentage : assignedPercentage,
                unassignedPercentage : unassignedPercentage
            }        
        })
    }catch(error){
        console.log(error)
        return res.status(400).json({error : "Something went wrong"})
    }
}