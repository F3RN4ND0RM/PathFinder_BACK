import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";


//Defining Abilities sequelize model
const Levels = sequelize.define('Levels',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        modelName : 'Levels',        
        tableName : 'Levels',
        freezeTableName : true
    }
)

export default Levels