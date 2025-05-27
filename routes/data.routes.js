import { Router } from 'express'
import {getData} from '../controllers/data.controller.js'
import {validatesLvl2} from "../middlewares/lvl2-validator.js"
import {validatesJWT} from '../middlewares/jwt-validator.js'
const router = Router()

//Defining get abilitires route
router.get('/',[
    validatesJWT,
    validatesLvl2
], getData)

export default router