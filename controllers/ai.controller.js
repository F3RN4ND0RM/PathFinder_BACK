

import { Op } from "sequelize"
import {Employees, Courses, Certifications,Projects, Roles} from "../models/associations.js"
import sequelize from "../db/db.js"
import dotenv from 'dotenv'; 
import OpenAI from "openai";
import { response } from "express";
dotenv.config()


export const coursesRecommendations = async(req, res) =>{
    
    const employeeId = req.employeeId
    const client = new OpenAI({
        apiKey : process.env.OAIKEY,
        baseURL : "https://api.deepseek.com/v1"})
            
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

        const certifications = await Employees.findByPk(employeeId,{
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
        
        let context = {context :{ 
            certifications,
            availableCourses,
            tecnologias,
            meta, 
            proyecto,
            task: "Regresa un texto arreglo plano, no añadas texto. Con base en las certificaciones del empleado, los cursos disponibles y sus intereses (tecnologías, meta y proyecto), genera un arreglo de los ID de los cursos más relevantes para alcanzar su meta y completar su proyecto. Devuelve únicamente un arreglo plano con los ID numéricos más apropiados en orden de prioridad. considera el nivel de expertiz según las certificaciones"         
        }}



        const response = await client.chat.completions.create({            
            model:"deepseek-chat",
            messages:[
                {"role": "user", "content": JSON.stringify(context)}
            ]
            }
        )
        
        const coursesRecommended = JSON.parse(response.choices[0].message.content) 
                    
        let courses = await Courses.findAll({
            where: {
              id: {
                [Op.in]: coursesRecommended
              }
            }
          });

        return res.status(200).json(courses)

    }catch(error){
        console.log(error)
        return res.status(400).json(error)
    }
}