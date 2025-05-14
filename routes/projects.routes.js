import { Router } from 'express'

import { check } from 'express-validator'
import { checkValidator } from '../middlewares/check-validator.js'
import {validatesLvl2} from "../middlewares/lvl2-validator.js"
import {validatesJWT} from '../middlewares/jwt-validator.js'
import {getProjects, createProject, finishProject, createRoles, getProject, assignToRole} from "../controllers/projects.controller.js"
import {expirationValidation} from "../middlewares/expiration-validator.js"
const router = Router()


router.get('/:projectId', [
    validatesJWT,
    validatesLvl2
], getProject)

router.get('/', [
    validatesJWT,
], getProjects)


router.post('/roles', [
    check('projectId' , 'projectId is empty').notEmpty(),
    check('roles' , 'roles should be an array').isArray(),
    checkValidator,
    validatesJWT,
    validatesLvl2,
], createRoles)



router.put('/assign', [
    check('roleId' , 'roleId empty').notEmpty(),
    check('employeeId' , 'employeeId empty').notEmpty(),
    checkValidator,
    validatesJWT,
    validatesLvl2,
], assignToRole)

router.post('/',[
    check('name' , 'name empty').notEmpty(),
    check('description' , 'description empty').notEmpty(),    
    check('expiration' , 'expiration invalid').notEmpty(),
    checkValidator,
    expirationValidation,
    validatesJWT,
    validatesLvl2,
], createProject)



router.put('/',[
    check('projectId' , 'projectId empty').notEmpty(),
    checkValidator,    
    validatesJWT,
    validatesLvl2,
], finishProject)







export default router