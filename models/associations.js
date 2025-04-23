import Abilities from "./abilities.model.js";
import Employees from "./employees.model.js";
import Absinfo from "./absinfo.model.js";
import Courses from  "./courses.model.js";
import Courseinfo from "./courseinfo.model.js";
import Assigned from "./assigned.model.js"
import Roles from "./roles.model.js";
import Projects from "./projects.model.js";

Employees.belongsToMany(Abilities, {as : 'abilitiesOfEmployee', foreignKey : 'idemployee', through : Absinfo})
Abilities.belongsToMany(Employees, {as: 'employeesByAbility', foreignKey : 'idabs', through : Absinfo })

Employees.belongsToMany(Courses, {as : 'coursesOfEmployee', foreignKey : 'idEmployee', through : Courseinfo})
Courses.belongsToMany(Employees, {as: 'employeesByCourse', foreignKey : 'idCourse', through : Courseinfo })

Employees.belongsToMany(Roles, {as : 'rolesOfEmployee', foreignKey : 'idEmployee', through : Assigned})
Roles.belongsToMany(Employees, {as : 'rolesByEmployee', foreignKey : 'idRole', through : Assigned})
Projects.hasMany(Roles, { foreignKey : 'idProject'})
Roles.belongsTo(Projects, { foreignKey : 'idProject'})

export { Employees, Abilities, Courses,Roles, Projects };