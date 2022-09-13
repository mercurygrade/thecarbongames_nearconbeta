const { connect, KeyPair, keyStores, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();
export const creatorAccountId = "thecarbongames.testnet";
export const CREDENTIALS_DIR:any = ".near-credentials";
export const credentialsPath:any = path.join(homedir, CREDENTIALS_DIR);
export const keyStore:any = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
export const config:any = {
keyStore,
networkId: "testnet",
nodeUrl: "https://rpc.testnet.near.org",
};