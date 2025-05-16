import { Router } from 'express'

import { check } from 'express-validator'
import { checkValidator } from '../middlewares/check-validator.js'
import {coursesRecommendations, staffRecommendations} from "../controllers/ai.controller.js"
import {validatesJWT} from "../middlewares/jwt-validator.js"
import {validatesLvl2} from "../middlewares/lvl2-validator.js"
const router = Router()

//Defining get ai recommendations route

router.get('/courses',
    validatesJWT,
    coursesRecommendations)

router.get('/staff',[    
    validatesJWT,
    
],staffRecommendations )


export default router