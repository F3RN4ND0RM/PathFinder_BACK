import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Levels from "./levels.model.js";

//Defining Empolyees sequelize model
const Employees = sequelize.define('Employee',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        pass : {
            type : DataTypes.STRING,
            allowNull : true
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        capability : {
            type : DataTypes.STRING,
            allowNull : true
        },
        rolename : {
            type : DataTypes.STRING,
            allowNull : true
        },
        percentage : {
            type : DataTypes.INTEGER,
            default : 0
        },
        startdate : {
            type : DataTypes.DATE,      
            default : Date()              
        },
        staff : {
            type : DataTypes.BOOLEAN,
            default : true
        },
        idlevel : {
            type : DataTypes.INTEGER,
            allowNull : false,
            default : 1,
            references :{
                model: Levels,
                key: 'id'
            }
        },
        otp : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        modelName : 'Employee',
        freezeTableName : true,
        tableName : 'Employee'
    }
)

export default Employees