import { SendFungibleToken, SendNearToken } from "../../src/utils/send_tokens";
import {creatorAccountId} from "../config";
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = ""
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
require("dotenv").config();
export const convertCreditToCarbonToken = async (req, res) =>{
        let userid = req.body.userid;
        let credit = req.body.credit;
        //get the user credits
        const snapshot = await db.collection('users').doc(userid).get("credit");
        let currentUserCredit = snapshot.data().credits; 
        if(credit >currentUserCredit){
             res.send({
                status:'failed',
                data:null,
                error:`Insufficient Credits to make this conversion`,
                })
        }
        else{
            let collectionRef =  await  db.collection('near_wallet');
            let query = await collectionRef.where('userId','==',userid).get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                  const sender = creatorAccountId;
                  const receiver = doc.data().accountId;
                  const networkId = 'testnet';
                  SendFungibleToken(sender, receiver, networkId, credit, (response)=>{
                      res.send({data:response})
                  });
              });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.send({
                  status:'failed',
                  data:null,
                  error:`User doesnt have a Near Wallet`,
                  })
            });
        }
 }