import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Courses from "./courses.model.js";
import Employees from "./employees.model.js";


//Defining Abilities sequelize model
const Courseinfo = sequelize.define('Courseinfo',
    {
        status : {
            type : DataTypes.INTEGER,
            defaultValue : 1,
            allowNull : false,
        },
        favstatus : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
        },
        idCourse : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Courses,
                key: 'id'
            }
        },
        idEmployee : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Employees,
                key: 'id'
             }
        }
    },
    {
        modelName : 'Courseinfo',
        tableName : 'Courseinfo',
        freezeTableName : true
    }
)

export default Courseinfo