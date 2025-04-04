import { Router } from 'express'
import {getAbilities} from '../controllers/abilities.controller.js'
import { validatesJWT } from '../middlewares/jwt-validator.js'
import { validatesAbilities } from '../middlewares/abilities-validator.js'
import { check } from 'express-validator'
import { checkValidator } from '../middlewares/check-validator.js'

const router = Router()

//Defining get abilitires route
router.get('/',getAbilities)

export default router