import Abilities from "./abilities.model.js";
import Employees from "./employees.model.js";
import Absinfo from "./absinfo.model.js";
import Courses from  "./courses.model.js";
import Courseinfo from "./courseinfo.model.js";


Employees.belongsToMany(Abilities, {as : 'abilitiesOfEmployee', foreignKey : 'idemployee', through : Absinfo})
Abilities.belongsToMany(Employees, {as: 'employeesByAbility', foreignKey : 'idabs', through : Absinfo })

Employees.belongsToMany(Courses, {as : 'coursesOfEmployee', foreignKey : 'idEmployee', through : Courseinfo})
Courses.belongsToMany(Employees, {as: 'employeesByCourse', foreignKey : 'idCourse', through : Courseinfo })


export { Employees, Abilities, Courses };