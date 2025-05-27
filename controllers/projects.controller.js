import Assigned from "../models/assigned.model.js"
import {Employees, Projects, Roles} from  "../models/associations.js"
import sequelize from "../db/db.js"



/*  Delete assignations
    Returns { msg: Assignation deleted} if ok
*/
export const deleteAssignation = async(req, res) =>{

    const assignationId = req.body.idAssignation

    const transaction = await sequelize.transaction();

    try{

        const assignation = await Assigned.findByPk(assignationId,{transaction})

        if(!assignation)
            return res.status(404).json({error: "something went wrong"})

        await assignation.update({
            status: false,
            transaction  
        });


        
        await Employees.update(
            { staff: true },
            { where: { id: assignation.idEmployee }, transaction }
        );

        await transaction.commit();


        return res.status(200).json({msg: "Assignation deleted"})

    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}



/*  set employee to especific project's role
    Returns { msg: employee setted} if ok
*/
export const assignToRole = async(req, res) =>{

    const employeeId = req.body.employeeId
    const roleId = req.body.roleId
    const transaction = await sequelize.transaction();

    try{

        const existingAssignment = await Assigned.findOne({
        where: {
            idEmployee: employeeId,
            idRole: roleId
        },
        transaction});
        
        if (existingAssignment)
            return res.status(400).json({error: "already assigned"})
        

        await Assigned.create({
            status: true,
            idEmployee: employeeId,
            idRole: roleId
        }, { transaction });

        await Employees.update(
            { staff: false },
            { where: { id: employeeId }, transaction }
        );

        await transaction.commit();


        return res.status(200).json({msg: "employee assigned"})

    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}


/*  adds roles to especific project
    Returns { msg: roles added } if ok
*/
export const createRoles = async(req, res) =>{
    const projectId = req.body.projectId
    const roles = req.body.roles
    const rolesOk = roles.map(role => ({
        ...role,
        idProject: projectId
    }));
    try{

        const project = await Projects.findByPk(projectId)
        if(!project)
            return res.status(400).json({error :  "Invalid project"})

        const rolesProject = await Roles.bulkCreate(
            rolesOk
        )

        return res.status(200).json({msg : "roles added"})
        
    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}



/* change project status to finish
    Returns { msg: PRoject finished } if ok
*/
export const finishProject = async(req, res) =>{
    const projectId = req.body.projectId
    

    try{
        const project = await Projects.findByPk(projectId)

        if(!project)
            return res.status(400).json({error :  "Invalid project"})

        await project.update({
            status : false,
            endDate : Date.now()
        })

        return res.status(200).json({msg :  "Project finished"})
        
    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}


/* create Project
    Returns { msg : project id created} if ok
*/
export const createProject = async(req, res) =>{
    const {name, description, expiration} = req.body
    try{
        const project = await Projects.create({
            name : name,
            description : description,
            startDate : expiration,            
        })

        if(project)
            return res.status(200).json({msg: `project ${project.id} created`})

        return res.status(400).json({error: `something went wrong`})

    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

/* get especific project infor
    Returns { project} if ok
*/
export const getProject = async(req, res) =>{
    const projectId = req.params.projectId
    try{
        
        const project = await Projects.findByPk(projectId,{
            where : {status :  true},
            attributes : ['id', 'name', 'description', 'startDate', 'endDate', 'status'],
            include : {
                model : Roles,                                
                include : {
                    model : Employees,
                    as: 'rolesByEmployee',                    
                    attributes : ['id', 'name', 'email', 'rolename'],
                    through : {
                        attributes : ['createdAt', 'updatedAt', 'status', 'id']
                    },                    
                },    
            }

        })

        if(project)
            return res.status(200).json({project})

        return res.status(200).json({msg: "invalid project"})
    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}



 /* get RPojects avilables
    Returns { available projects} if ok
*/
export const getProjects = async(req, res) =>{
    try{
        const projects = await Projects.findAll({
            where : {status :  true},
            attributes : ['id', 'name', 'description', 'startDate', 'endDate'],
            include : {
                model : Roles,                                
                include : {
                    model : Employees,
                    as: 'rolesByEmployee',                    
                    attributes : ['id', 'name', 'email', 'rolename'],
                    through : {
                        attributes : ['createdAt', 'updatedAt']
                    },                    
                },    
            }

        })

        if(projects.length > 1)
            return res.status(200).json({projects})

        return res.status(200).json({msg: "Not available projects"})
    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}