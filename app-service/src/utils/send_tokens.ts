
const nearAPI  = require('near-api-js');
import {keyStore,config } from "../config";

const { connect, KeyPair, keyStores, utils } = nearAPI;
const path = require("path");
const homedir = require("os").homedir();
const request = require('request');
//this is required if using a local .env file for private key
require('dotenv').config();
export const SendFungibleToken = async (sender:string, receiver:string,networkId:string, carbonTokenAmount:number, callback:any ) =>{
  
    const near = await connect({ ...config, keyStore });
    const creatorAccount = await near.account(sender);
    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.publicKey.toString();
    await keyStore.setKey(config.networkId, receiver, keyPair);
    return await creatorAccount.functionCall({
      contractId: "testnet",
      methodName: "ft_transfer",
      signer_id: sender,
      public_key: publicKey,
      nonce: 123,
      receiver_id:receiver,
      args: {
        receiver_id: receiver,
        amount: "1"
      },
      gas: "300000000000000",
      deposit: "1250000000000000000000",
    });
}

export const SendNearToken = async (sender:string, receiver:string,networkId:string, carbonTokenAmount:number, callback:any ) =>{
     
    const amount = carbonTokenAmount; //utils.format.parseNearAmount(carbonTokenAmount);
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
    const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
    // configuration used to connect to NEAR
    const config = {
        networkId,
        keyStore,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`
    };

    // connect to NEAR! :) 
    const near = await connect(config);
    // create a NEAR account object
    const senderAccount = await near.account(sender);

    try {
        // here we are using near-api-js utils to convert yoctoNEAR back into a floating point
        console.log(`Sending ${amount}C02 from ${sender} to ${receiver}...`);
        // send those tokens! :)
        const result = await senderAccount.sendMoney(receiver, amount,"");
        // console results
        console.log('Transaction Results: ', result.transaction);
        console.log('--------------------------------------------------------------------------------------------');
        console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
        console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
        console.log('--------------------------------------------------------------------------------------------');
        callback(result);
    } catch(error) {
        // return an error if unsuccessful
        console.log(error);
    }
    
}

 