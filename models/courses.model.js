import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";


//Defining Courses sequelize model
const Courses = sequelize.define('Courses',
    {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.STRING,
            allowNull : false
        },
        imgUrl : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        modelName : 'Courses',        
        tableName : 'Courses',
        freezeTableName : true
    }
)

export default Courses