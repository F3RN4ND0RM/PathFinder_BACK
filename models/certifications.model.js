import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";


//Defining Roles sequelize model
const Certifications = sequelize.define('Certifications',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        modelName : 'Certifications',        
        tableName : 'Certifications',
        freezeTableName : true
    }
)

export default Certifications