import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Employees from "./employees.model.js";

//Defining Goals sequelize model
const Goals = sequelize.define('Goals',
    {
        idEmployee : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Employees,
                key: 'id'
             }
        },
        technologies : {
            type : DataTypes.STRING,
            allowNull : false,
            defaultValue : ""
        },
        goals : {
            type : DataTypes.STRING,
            allowNull : false,
            defaultValue : ""
        },
        project : {
            type : DataTypes.STRING,
            allowNull : false,
            defaultValue : ""
        }
    },
    {
        modelName : 'Goals',        
        tableName : 'Goals',
        freezeTableName : true
    }
)

export default Goals