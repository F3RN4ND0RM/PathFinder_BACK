import Abilities from "./abilities.model.js";
import Employees from "./employees.model.js";
import Absinfo from "./absinfo.model.js";
import Courses from  "./courses.model.js";
import Courseinfo from "./courseinfo.model.js";
import Assigned from "./assigned.model.js"
import Roles from "./roles.model.js";
import Projects from "./projects.model.js";
import Levels from "./levels.model.js"
import Certinfo from "./certinfo.model.js"
import Certifications from "./certifications.model.js";
Employees.belongsToMany(Abilities, {as : 'abilitiesOfEmployee', foreignKey : 'idemployee', through : Absinfo})
Abilities.belongsToMany(Employees, {as: 'employeesByAbility', foreignKey : 'idabs', through : Absinfo })

Employees.belongsToMany(Courses, {as : 'coursesOfEmployee', foreignKey : 'idEmployee', through : Courseinfo})
Courses.belongsToMany(Employees, {as: 'employeesByCourse', foreignKey : 'idCourse', through : Courseinfo })

Employees.belongsToMany(Roles, {as : 'rolesOfEmployee', foreignKey : 'idEmployee', through : Assigned})
Roles.belongsToMany(Employees, {as : 'rolesByEmployee', foreignKey : 'idRole', through : Assigned})

Projects.hasMany(Roles, { foreignKey : 'idProject'})
Roles.belongsTo(Projects, { foreignKey : 'idProject'})

Levels.hasMany(Employees, {foreignKey : 'idlevel'})
Employees.belongsTo(Levels, {foreignKey : 'idlevel'})

Employees.belongsToMany(Certifications, {as : 'certificationsOfEmployee', foreignKey : 'idEmployee', through : Certinfo})
Certifications.belongsToMany(Employees, {as : 'employyesByCertifications', foreignKey : 'idCert', through : Certinfo})

export { Employees, Abilities, Courses,Roles, Projects, Levels, Certifications };