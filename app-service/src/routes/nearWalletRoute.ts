import express from 'express'
import { createWallet, getWalletBalance, getWalletDetails, getTransactionStatus,getTransactionDetails,batchTransactions,listNFTs } from '../controller/nearWalletController'
const nearWalletRoute = express()
nearWalletRoute.post('/create-wallet',  createWallet)
nearWalletRoute.get('/wallet-balance', getWalletBalance)
nearWalletRoute.get('/wallet-details', getWalletDetails)
nearWalletRoute.post('/transaction-status', getTransactionStatus)
nearWalletRoute.post('/transaction-details', getTransactionDetails)
nearWalletRoute.post('/batch-transactions', batchTransactions)
nearWalletRoute.post('/list-nfts', listNFTs)
module.exports = nearWalletRoute