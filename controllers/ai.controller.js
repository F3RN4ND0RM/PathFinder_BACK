

import { Op } from "sequelize"
import {Employees as Emp, Abilities as Abs, Projects, Courses, Certifications,Assigned, Roles, Goals} from "../models/associations.js"
import sequelize from "../db/db.js"
import dotenv from 'dotenv'; 
import OpenAI from "openai";
import {getEmployeesStaff} from "../controllers/employees.controller.js"
import { format } from "sequelize/lib/utils";


dotenv.config()


export const coursesRecommendations = async(req, res) =>{
    
    const employeeId = req.employeeId

    const goal = await Emp.findByPk(employeeId,{
        attributes : [],
        include : {
            model : Goals,
            attributes : ['technologies', 'goals', 'project']

        }
    })


    if(!goal)
        return res.status(400).json({error : "Goals not setted"})
   
    const client = new OpenAI({
        apiKey : process.env.OAIKEY,
        baseURL : "https://api.deepseek.com/v1"})
            
    const {technologies, goals, project} = goal.dataValues.Goal
        

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

        const certifications = await Emp.findByPk(employeeId,{
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
            technologies,
            goals, 
            project,
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

export const staffRecommendations = async(req, res)=>{
    const employeeId = req.employeeId
    const roleId = req.query.roleId
    const client = new OpenAI({
        apiKey : process.env.OAIKEY,
        baseURL : "https://api.deepseek.com/v1"})

    try{
        

        const roles = await Roles.findAll({
            where : {
                id : roleId,
            },            
            attributes : ['id', 'name'],
  
        })

        const staff = await Emp.findAll({
            attributes : ['id', 'name'],
            where : {staff : false},
            include : [{
                model: Abs,
                as: 'abilitiesOfEmployee',      
                attributes : ['name'],
                through : {
                    attributes : []
                }
            }, 
            {
                model : Roles,
                attributes : [ 'name'],
                as:'rolesOfEmployee', 

                through : {
                    attributes : [],                
                },                                
            },{
                model : Certifications,
                as : 'certificationsOfEmployee',
                attributes : ['name'],
                through : {
                    attributes : [],                
                },     
        }]})
     
        let context = {context :{                             
            task: "Assign obligatory 10 employees to the role based on their abilities, previous roles, and certifications. i expect an JSON as response as setted on outpu_format without any extra information or punctuations",
            input_format: {
                staff: [  //available employees
                    {
                        id: "employeeId", //id of employee
                        name: "employeeName", //name of employee
                        abilitiesOfEmployee: [ {name: "name of ability"}],  //abilities of employee
                        rolesOfEmployee: [{name:"name of previous role"}], //previous roles of employee
                        certificationsOfEmployee: [{name : "name of certification"}] //cerifications of employee
                    }
                ],
                roles  : [ //available roles
                    {
                        id: "roleId",
                        name: "roleName"
                    }
                ]
                },
            output_format:
                {
                    rolename: [ //name of role
                        {
                            id: "employeeId", //id of employee
                            name: "employeeName", //name of employee
                        }
                    ]
                },           
            input :  {staff,roles }}}

        const response = await client.chat.completions.create({            
            model:"deepseek-chat",
            messages:[
                {"role": "user", "content": JSON.stringify(context)}
            ]
            }
        )        
        console.log(response.choices[0].message.content)
        let staffRecomended =response.choices[0].message.content       
        staffRecomended = JSON.parse(staffRecomended.slice(7,staffRecomended.length-3))            
        return res.status(200).json(staffRecomended)
    }catch(error){
        console.log(error)
        return res.status(400).json(error)
    }
}