import { Router } from 'express'
import { check } from "express-validator";
import {checkValidator} from "../middlewares/check-validator.js"
import {logIn, signUp} from '../controllers/employees.controllers.js'
const router = Router()

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