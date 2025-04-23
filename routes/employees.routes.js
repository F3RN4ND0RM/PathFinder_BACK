import { Router } from 'express'
import { check } from "express-validator";
import {checkValidator} from "../middlewares/check-validator.js"
import {logIn, signUp, updateEmployeeInfo, getEmployeeInfo, addAbilities, getEmployeeCourses, getEmployeeProject} from '../controllers/employees.controller.js'
import {validatesJWT} from '../middlewares/jwt-validator.js'
import { validatesAbilities } from '../middlewares/abilities-validator.js';
const router = Router()


//getsProject from employee
router.get('/projects', [                 
    //Validates JWT
    validatesJWT
], getEmployeeProject)


//getsCourses from employee
router.get('/courses', [                 
    //Validates JWT
    validatesJWT
], getEmployeeCourses)


//Adds Abilities to employees
router.put('/abilities', [    
    check('abilityId', 'Ability Id empty').notEmpty(),
    checkValidator,     
    //Validates JWT
    validatesJWT,
    //Validates Abilities existance
    validatesAbilities    
], addAbilities)


//Get Employee Info
router.get('/' , [    
    //Validating JWT
    validatesJWT
], getEmployeeInfo)


//Updates Employees dats
router.put('/update' , [
    //Checking fields on body    
    check('name', 'name empty').notEmpty(),
    check('email', 'email empty').notEmpty(),
    check('password', 'password empty').notEmpty(),
    validatesJWT
], updateEmployeeInfo)


//Setting Passwor Route
router.post('/signup' , [
    //Checking email  on body
    check('email', 'email empty').notEmpty(),
    //Checking password  on body
    check('pass', 'password empty').notEmpty(),
    check('otp', 'otp empty').notEmpty(),
    checkValidator
], signUp)


//Login Route
router.post('/login' , [
    //Checking username on body
    check('email', 'email empty').notEmpty(),
    checkValidator
], logIn)

export default router