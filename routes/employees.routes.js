import { Router } from 'express'
import { check } from "express-validator";
import {checkValidator} from "../middlewares/check-validator.js"
import {updateEmployeesCourse, createEmploye, logIn, signUp, updateEmployeeInfo, getEmployeeTimeline, getEmployeeInfo, addAbilities, getEmployeeCourses, getEmployeeProject, getEmployeeCertifications, addCertifications, addCourse, updateGoals, getEmployeesStaff} from '../controllers/employees.controller.js'
import {validatesJWT} from '../middlewares/jwt-validator.js'
import { validatesAbilities } from '../middlewares/abilities-validator.js';
import {validatesCertifications} from "../middlewares/certifications-validator.js"
import { expirationValidation } from '../middlewares/expiration-validator.js';
import {validatesCourse} from "../middlewares/courses-validator.js"
import {validatesLvl2} from "../middlewares/lvl2-validator.js"

const router = Router()



router.put('/courseStatus/', [
    check('courseId', 'idCourse can not be empty').notEmpty(),
    check('status', 'ivalid status').isNumeric(),
    checkValidator,
    validatesJWT,
    validatesCourse
], updateEmployeesCourse)


router.post('/add', [    
    check('name', 'name can not be empty').notEmpty(),
    check('email', 'email can not be empty').notEmpty(),
    check('idlevel', 'idlevel can not be empty').notEmpty(),
    checkValidator,         
    validatesJWT,
    validatesLvl2], createEmploye)

//getsProject from employee
router.get('/timeline', [                 
    //Validates JWT
    validatesJWT
], getEmployeeTimeline)


//Gets staff
router.get('/staff', [      
    //Validates JWT
    validatesJWT,        
    validatesLvl2, 
], getEmployeesStaff)




//Adds course to employees
router.put('/goals', [    
    check('technologies', 'Technologies empty').notEmpty(),
    check('project', 'Project empty').notEmpty(),
    check('goals', 'goal empty').notEmpty(),
    checkValidator,         
    //Validates JWT
    validatesJWT,        
], updateGoals)

//Adds course to employees
router.put('/courses', [    
    check('courseId', 'Course Id empty').notEmpty(),
    check('favstatus', 'expiration not valid').notEmpty(),
    checkValidator,     
    validatesCourse,
    //Validates JWT
    validatesJWT,        
], addCourse)


//Adds certifications to employees
router.put('/certifications', [    
    check('certificationId', 'Certification Id empty').notEmpty(),
    check('expiration', 'expiration not valid').notEmpty(),
    checkValidator,     
    //Validates JWT
    validatesJWT,
    expirationValidation,
    validatesCertifications,     
], addCertifications)


//getsProject from employee
router.get('/certifications', [                 
    //Validates JWT
    validatesJWT
], getEmployeeCertifications)



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