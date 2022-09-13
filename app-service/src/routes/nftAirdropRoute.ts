import express from 'express'; 
import { airdropNFT } from '../controller/nftAirdropController';

const nftAirdropRoute = express()
nftAirdropRoute.post('/near/nft',  airdropNFT)
module.exports = nftAirdropRoute