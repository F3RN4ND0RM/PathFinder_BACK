import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";


//Defining Empolyees sequelize model
const Employees = sequelize.define('Employee',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        pass : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        capability : {
            type : DataTypes.STRING,
            allowNull : false
        },
        rolename : {
            type : DataTypes.STRING,
            allowNull : false
        },
        percentage : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        startdate : {
            type : DataTypes.DATE,
            allowNull : false
        },
        staff : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        },
        idlevel : {
            type : DataTypes.INTEGER,
            allowNull : false
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