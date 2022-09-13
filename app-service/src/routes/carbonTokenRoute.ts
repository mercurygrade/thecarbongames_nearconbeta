import express from 'express'; 
import { convertCreditToCarbonToken } from '../controller/carbonTokenController';

const carbonTokenRoute = express()
carbonTokenRoute.post('/convert-credit',  convertCreditToCarbonToken)
module.exports = carbonTokenRoute