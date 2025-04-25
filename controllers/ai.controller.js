

import { Op } from "sequelize"
import {Employees, Courses, Certifications,Projects, Roles} from "../models/associations.js"
import sequelize from "../db/db.js"



export const coursesRecommendations = async(req, res) =>{
    
    const employeeId = req.employeeId
    const tecnologias = "Me interesa aprender python y poder crear inteligencia artificial."
    const meta = "Mi meta es poder crear modelos de IA para poder automatizar los procesos en Accenture"
    const proyecto = "Creacion de modelos utilizando Gemini y OpenAI"

    try{        

        const availableCourses = await sequelize.query(`
            SELECT c.id, c.name, c.description
            FROM "Courses" c
            LEFT JOIN "Courseinfo" ec 
                ON c.id = ec."idCourse" AND ec."idEmployee" = :employeeId
            WHERE ec."idCourse" IS NULL
            ORDER BY c.id
        `, {
            replacements: { employeeId },
            type: sequelize.QueryTypes.SELECT
        });

        const availableCertifications = await Employees.findByPk(employeeId,{
            attributes : [],
            include : {
                model : Certifications,
                as : 'certificationsOfEmployee',
                attributes : ['id', 'name', 'description'],
                through: {
                    attributes : []
                }
            }
        })
        
        let data = {
            availableCourses,
            availableCertifications
        }
        return res.status(200).json(data)

    }catch(error){
        console.log(error)
        return res.status(400).json(error)
    }
}