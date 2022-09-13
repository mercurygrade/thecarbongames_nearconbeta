
const { exec } = require('child_process');
const { getFirestore } = require('firebase-admin/firestore');
 
const db = getFirestore();
require("dotenv").config();

//airdrops the provided wallet with NFT on signup
export const airdropNFT  = async(req,res)=>{
      let event_type = req.body.event_type; //wallet_connected | invitation | pool_completed
      let user_wallet = req.body.user_wallet; //user's near wallet

 

      let collectionRef =  await  db.collection('airdrop_nft_tracker');
      let query = await collectionRef.where('event_type','==',event_type)
      .where('reciever_wallet_id','==',user_wallet)
      .get()
      .then(snapshot => {
          //user has already been airdropped on this event type
          snapshot.forEach(doc => { 
            res.send({
              status:'failed',
              data:null,
              error:"User has been airdropped already",
              });
             })
             .catch(err => {
             
             // airdropUser() -ongoing
           });
      
           
      })
      .catch(err => {
          //user not found- send NFT to user -- TODO complete
          /*exec(`near call ${process.env.NFT1_OWNER_ID} nft_transfer '{"receiver_id": "${user_wallet}", "token_id": "nft-15"}' --accountId  ${process.env.NFT1_OWNER_ID}  --depositYocto 1`, (err, stdout, stderr) => {
            if (err) {
              // node couldn't execute the command
              return;
            }
            if(!stderr){
              res.send({
                status:'success',
                data:stdout,
                error:null,
                })
            }else{
              res.send({
                status:'failed',
                data:null,
                error:stderr,
                })
            }
            });*/
      });
}

