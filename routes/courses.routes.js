import { Router } from 'express'
import { check } from 'express-validator'
import { checkValidator } from '../middlewares/check-validator.js'
import {getCourses} from "../controllers/courses.controller.js"
import {validatesJWT} from "../middlewares/jwt-validator.js"
const router = Router()

router.get('/' ,[
        validatesJWT
    ], getCourses)


export default router