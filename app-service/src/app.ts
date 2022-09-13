import express from 'express';  
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser')
const carbonTokenRoute =  require('./routes/carbonTokenRoute');
const nearWalletRoute =  require('./routes/nearWalletRoute');
const nftAirdropRoute =  require('./routes/nftAirdropRoute');

const jsonParser = bodyParser.json()
app.use(cors());
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
}); 
app.use('/carbon',jsonParser, carbonTokenRoute)
app.use('/near', jsonParser, nearWalletRoute)
app.use('/airdrop', jsonParser, nftAirdropRoute)

app.listen(9067, () => 
{
    console.log("carbon app is listening");
});
export default app;