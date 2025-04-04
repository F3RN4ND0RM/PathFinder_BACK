import { Router } from 'express'
import {getAbilities} from '../controllers/abilities.controller.js'

const router = Router()

//Defining get abilitires route
router.get('/',
     getAbilities)

export default router