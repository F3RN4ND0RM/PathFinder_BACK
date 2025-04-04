import { Router } from 'express'
import { check } from "express-validator";
import {checkValidator} from "../middlewares/check-validator.js"
import {logIn, signUp, updateEmployee, getEmployeeInfo} from '../controllers/employees.controllers.js'
import {validatesJWT} from '../middlewares/jwt-validator.js'
const router = Router()


//Get Employee Ingo
router.get('/' , [    
    validatesJWT
], getEmployeeInfo)


//Updates Employees dats
router.put('/update' , [
    //Checking username on body
    validatesJWT
], updateEmployee)


//Setting Passwor Route
router.post('/signup' , [
    //Checking email  on body
    check('email', 'password empty').notEmpty(),
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