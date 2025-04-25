import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import db from '../db/db.js'
import employeeRoute from '../routes/employees.routes.js'
import abilitiesRoute from '../routes/abilities.routes.js'
import coursesRoute from '../routes/courses.routes.js'
import aiRoute from "../routes/ai.routes.js"
//Defining server class
class Server{

    app ; //aplicacion
    port //puerto en el que correra
    apiPaths = {
        employees : '/employees', //rutas,
        abilities : '/abilities',
        courses : '/courses',
        ai : '/ai'
    }

    //server constructor, inititilizes server
    constructor(){
        this.app = express(); 
        this.port = process.env.PORT || "9000"; //Defining port from .env

        this.middlewares(); 
        this.routes();
        this.dbConnection();
    }


    //db Connection testing
    async dbConnection() {
        try {
            //If ok            
            await db.authenticate();
            console.log('Database online');
        } catch (error) {
            //show error
            console.error(error);
        }
    }


    //Defining server middlewares 
    middlewares() {
        //cors
        this.app.use(cors({}));
        //body parser
        this.app.use(express.json())
        this.app.use(cookieParser());
        //carpeta publica
        this.app.use(express.static('public'))
    }

    //initialicing routes
    routes(){            
        //defining routes    
        this.app.use(this.apiPaths.employees, employeeRoute)
        this.app.use(this.apiPaths.abilities, abilitiesRoute)
        this.app.use(this.apiPaths.courses, coursesRoute)
        this.app.use(this.apiPaths.ai, aiRoute)
    }

    //Initilizes server
    listen(){
        this.app.listen(this.port, () =>{
            console.log("Server running on: "+ this.port)
        })
    }
}

export default Server;