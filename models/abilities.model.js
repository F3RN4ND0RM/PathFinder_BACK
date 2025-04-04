import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";


//Defining Abilities sequelize model
const Abilities = sequelize.define('Abilities',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        modelName : 'Abilities',        
        tableName : 'Abilities',
        freezeTableName : true
    }
)

export default Abilities