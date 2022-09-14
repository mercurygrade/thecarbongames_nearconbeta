
const { exec } = require('child_process');
const request = require('request');
const { connect, KeyPair, utils ,providers} = require("near-api-js");
import {keyStore,config, creatorAccountId } from "../config";
export const createWallet = async  (req, res) =>{
        let username = `${req.body.walletname}.${creatorAccountId}`;
         await NearAccountFunc(creatorAccountId,username, "0.01","CreateAccount").then((result:void,error:void)=>{
                // business logic with result
                res.send({status:'success',
                         data:result,
                         accountID: username,
                         error:error})
            }).catch((e)=>{
                //error handling logic
                res.send({
                    status:'failed',
                    data:null,
                    error:`Wallet Creation Failed. Cause::: ${e.toString()}`,
                    })
            });
}

export const getTransactionStatus = async  (req, res) =>{
    const provider = new providers.JsonRpcProvider(
        "https://archival-rpc.testnet.near.org"
    );
    const TX_HASH = req.body.tx_hash;
    const ACCOUNT_ID = req.body.sender_id;
    try{
        getState(TX_HASH, ACCOUNT_ID);
        async function getState(txHash, accountId) {
            const result = await provider.txStatus(txHash, accountId);
            res.send({
                status:'success',
                data:result,
                error:null,
                })
        }
    }catch(e){
        res.send({
            status:'failed',
            data:null,
            error:e,
            })
    }
}

export const getTransactionDetails = async  (req, res) =>{
    const near = await connect(config);
    const startBlock = req.body.startBlock;
    const endBlock = req.body.endBlock;
    const accountId = req.body.contract_id;
    const blockArr = [];
    let blockHash = endBlock;
    do {
      const currentBlock = await getBlockByID(blockHash);
      blockArr.push(currentBlock.header.hash);
      blockHash = currentBlock.header.prev_hash;
     } while (blockHash !== startBlock);
      const blockDetails = await Promise.all(
      blockArr.map((blockId) =>
        near.connection.provider.block({
          blockId,
        })
      )
    );
    const chunkHashArr = blockDetails.flatMap((block) =>
      block.chunks.map(({ chunk_hash }) => chunk_hash)
    );
    const chunkDetails = await Promise.all(
      chunkHashArr.map(chunk => near.connection.provider.chunk(chunk))
    );
    const transactions = chunkDetails.flatMap((chunk) =>
      (chunk.transactions || []).filter((tx) => tx.signer_id === accountId)
    );
    const txsLinks = transactions.map((txs) => ({
      method: txs.actions[0].FunctionCall.method_name,
      link: `https://explorer.testnet.near.org/transactions/${txs.hash}`,
    }));
    res.send({
        status:'success',
        data:{
            matching_transactions: transactions,
            transaction_link: txsLinks
        },
        error:null,
    })
}

async function getBlockByID(blockID) {
    const near = await connect(config);
    const blockInfoByHeight = await near.connection.provider.block({
      blockId: blockID,
    });
    return blockInfoByHeight;
  }
   
export const batchTransactions = async  (req, res) =>{
    const CONTRACT_NAME = req.body.contract_name;
    const WHITELIST_ACCOUNT_ID  = req.body.whitelist_account_id;
    const near = await connect({ ...config, keyStore });
    const account = await near.account(CONTRACT_NAME);
    const newArgs = { staking_pool_whitelist_account_id: WHITELIST_ACCOUNT_ID };
    const result = await account.signAndSendTransaction({
        receiverId: CONTRACT_NAME,
        actions: [ 
        ],
    });
    res.send({status:'success',
    data:null,
    error:null})
}


export const getWalletBalance = async  (req, res) =>{
    let username = `${req.body.walletname}`;
    await NearAccountFunc(creatorAccountId,username, null,"GetAccountBalance").then((result:void,error:void)=>{
        res.send({status:'success',
                 data:result,
                 error:error})
    }).catch((e)=>{
        res.send({
            status:'failed',
            data:null,
            error:`Couldn't fetech Wallet Balance`,
            })
    });
}
export const getWalletDetails = async  (req, res) =>{
    let username = `${req.body.walletname}`;
    await NearAccountFunc(creatorAccountId,username, null,"GetAccountDetails").then((result:void,error:void)=>{
        res.send({status:'success',
                 data:result,
                 error:error})
    }).catch((e)=>{
        res.send({
            status:'failed',
            data:null,
            error:`Couldn't fetech Wallet Balance`,
            })
    });
}
export const listNFTs = async  (req, res) =>{
    let user_wallet = req.body.user_wallet; //user's near wallet
    exec(`near view ${process.env.NFT1_OWNER_ID} nft_tokens_for_owner '{"account_id": "${user_wallet}"}'`, (err, stdout, stderr) => {
        if (err) {
          console.log(err)
          return;
        }
        if(!stderr){
          let cleanResponse = stdout.replace(/\n/g,"")
          .replace(`View call:  .nft_tokens_for_owner({\"account_id\": \"${user_wallet}\"})`,"")
          .replace("[","")
          .replace("]","")
          .split("\n")
          .toString()
          res.json({
            status:'success',
            data: cleanResponse,
            error:null,
            })
        }
        else{
          res.send({
            status:'failed',
            data:null,
            error:stderr,
            })
        }
        });
}
async function NearAccountFunc(creatorAccountId, userAccountId, amount,actionType) 
{
    const near = await connect({ ...config, keyStore });
    const creatorAccount = await near.account(creatorAccountId);
    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.publicKey.toString();
    await keyStore.setKey(config.networkId, userAccountId, keyPair);
    if(actionType === "CreateAccount"){
        return await creatorAccount.createAccount(
            userAccountId, // new account name
            publicKey, // public key for new account
            "2010000000000000000000" // initial balance for new account in yoctoNEAR
          );
    }
    else if(actionType === "GetAccountBalance"){
        console.log(userAccountId)
        if(userAccountId === "" || userAccountId === null || userAccountId === "undefined"){
            return null;
        }else{
            const userAccount = await near.account(userAccountId);
            return await userAccount.getAccountBalance();
        }
    }
    else if(actionType === "GetAccountDetails"){
        console.log(userAccountId)
        if(userAccountId === "" || userAccountId === null || userAccountId === "undefined"){
            return null;
        }else{
            const userAccount = await near.account(userAccountId);
            return await userAccount.getAccountDetails();
        }
    }
    else{
        return null;
    }
}