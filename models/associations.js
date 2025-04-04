import Abilities from "./abilities.model.js";
import Employees from "./employees.model.js";
import Absinfo from "./absinfo.model.js";



Employees.belongsToMany(Abilities, {as : 'AbilitiesA', foreignKey : 'idemployee', through : Absinfo})
Abilities.belongsToMany(Employees, {as: 'AbilitiesE', foreignKey : 'idabs', through : Absinfo })

export { Employees, Abilities };