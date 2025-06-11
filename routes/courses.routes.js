import { Router } from 'express'

import {getCourses} from "../controllers/courses.controller.js"
import {validatesJWT} from "../middlewares/jwt-validator.js"

const router = Router()

router.get('/' ,[
        validatesJWT
    ], getCourses)



export default router