import { Sequelize, DataTypes} from "sequelize";
import sequelize from "../db/db.js";
import Certifications from "./certifications.model.js"
import Employees from "./employees.model.js";

//Defining Roles sequelize model
const Certinfo = sequelize.define('Certinfo',
    {
        expiration : {
            type : DataTypes.DATE,
            allowNull : false
        },
        idCert : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references :{
                model: Certifications,
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
        modelName : 'Certinfo',        
        tableName : 'Certinfo',
        freezeTableName : true
    }
)

export default Certinfo