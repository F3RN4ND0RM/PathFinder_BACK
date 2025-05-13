import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";

import Assigned from "./assigned.model.js";

//Defining Projects sequelize model
const Feedback = sequelize.define('Feedback',
    {
        description : {
            type : DataTypes.STRING,
            allowNull : false
        },       
        idAssigned : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Assigned,
                key: 'id'
            }
        }
    },
    {
        modelName : 'Feedback',        
        tableName : 'Feedback',
        freezeTableName : true
    }
)

export default Feedback