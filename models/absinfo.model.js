import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Abilities from "./abilities.model.js";
import Employees from "./employees.model.js";


//Defining Abilities sequelize model
const Absinfo = sequelize.define('Absinfo',
    {
        idabs : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Abilities,
                key: 'id'
            }
        },
        idemployee : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Employees,
                key: 'id'
             }
        }
    },
    {
        modelName : 'Absinfo',
        tableName : 'Absinfo',
        freezeTableName : true
    }
)

export default Absinfo