import { Router } from 'express'

import { check } from 'express-validator'
import { checkValidator } from '../middlewares/check-validator.js'
import {coursesRecommendations} from "../controllers/ai.controller.js"
import {validatesJWT} from "../middlewares/jwt-validator.js"

const router = Router()

//Defining get ai recommendations route

router.get('/courses',
    validatesJWT,
    coursesRecommendations)



export default router