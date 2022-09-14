
const { exec } = require('child_process');
const { getFirestore } = require('firebase-admin/firestore');
 
const db = getFirestore();
require("dotenv").config();

//airdrops the provided wallet with NFT on signup
const fs = require('fs');
const path = require("path")
 
export const airdropNFT  = async(req,res)=>{
      let event_type = req.body.event_type; //wallet_connected | invitation | pool_completed
      let user_wallet = req.body.user_wallet; //user's near wallet
      airdropUser(user_wallet,event_type,res);
}
const airdropUser = async (user_wallet,event_type,res)=>{
  let nftPrefix = "nft-"
  if(event_type === "invitation"){
    nftPrefix = "nft-present-"
  }
  else  if(event_type === "pool_completed"){
    nftPrefix = "nft-future-";
  }
  else{
    nftPrefix = "nft-";
  }
  let fileTracker = path.join(__dirname, '..', 'data', `track${nftPrefix}.data`);
  console.log("fileTracker", fileTracker)
  //TODO:: persist to a db instead of a file
  fs.readFile(fileTracker, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    
    let increamentID  = nftPrefix === "nft-" ? Math.floor(data.split("-")[1]) + 1 :Math.floor(data.split("-")[2]) + 1;
    let result = data.replace(data, `${nftPrefix}${increamentID}`);
    let tokenID=`${nftPrefix}${increamentID}`;
    
 
    exec(`near call ${process.env.NFT1_OWNER_ID} nft_transfer '{"receiver_id": "${user_wallet}", "token_id": "${tokenID}"}' --accountId  ${process.env.NFT1_OWNER_ID}  --depositYocto 1`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(err)
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
      });
      //update tracker
    fs.writeFile(fileTracker, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });  
}