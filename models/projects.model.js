import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Roles from "./roles.model.js"

//Defining Projects sequelize model
const Projects = sequelize.define('Projects',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.STRING,
            allowNull : false
        },
        status : {
            type : DataTypes.STRING,        
        },
        startDate : {
            type : DataTypes.DATE,
            allowNull : false
        },
        endDate : {
            type : DataTypes.DATE,
        },
        idClient : {
            type : DataTypes.INTEGER,
        }
    },
    {
        modelName : 'Projects',        
        tableName : 'Project',
        freezeTableName : true
    }
)

export default Projects