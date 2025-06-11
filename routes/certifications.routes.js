import { Router } from 'express'

import {getCertifications} from "../controllers/certifications.controller.js"
import {validatesJWT} from "../middlewares/jwt-validator.js"

const router = Router()

router.get('/' ,[
        validatesJWT
    ], getCertifications)



export default router