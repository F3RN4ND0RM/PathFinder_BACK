import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Roles from "./roles.model.js"
import Employees from "./employees.model.js";

//Defining Assigned sequelize model
const Assigned = sequelize.define('Assigned',
    {
        status : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        },
        idRole : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Roles,
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
        modelName : 'Assigned',        
        tableName : 'Assigned',
        freezeTableName : true
    }
)

export default Assigned