import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Projects from "./projects.model.js"

//Defining Roles sequelize model
const Roles = sequelize.define('Roles',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.STRING,
            allowNull : false
        },
        idProject : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Projects,
                key: 'id'
            }
        }
    },
    {
        modelName : 'Roles',        
        tableName : 'Roles',
        freezeTableName : true
    }
)

export default Roles