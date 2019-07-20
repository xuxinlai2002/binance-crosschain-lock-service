import web3 from 'services/web3'
import Tx from 'ethereumjs-tx'
import {
    PLATFORM_ETH_SIDECHAIN_PRIVKEY,
    PLATFORM_ETH_SIDECHAIN_ADDR,
    ETH_CONTRACT_ABI,
    ETH_CONTRACT_BYTECODE
} from 'config/config'
import {
    query,
    insert,
    update
} from 'services/db'

import keyth from 'keythereum'

exports.details = async function (req,res) {

    let launch_key = req.query.launch_key
    let id = req.query.id
    // // ----------- 0

    const [contracts] = await query('select * from ccls_contracts where activity_id = ? limit 1',[id]);
    let contract_address = contracts[0].contract_address
    // const myContract = new web3.eth.Contract(ETH_CONTRACT_ABI);
    // myContract.options.address = contract_address;

    const privateKey = new Buffer(PLATFORM_ETH_SIDECHAIN_PRIVKEY, 'hex');
    const nonce = await web3.eth.getTransactionCount(PLATFORM_ETH_SIDECHAIN_ADDR);
    const contract = new web3.eth.Contract(ETH_CONTRACT_ABI,contract_address);
    const cdata = contract.methods.launch(launch_key).encodeABI()

    let tx1 = {
        from: PLATFORM_ETH_SIDECHAIN_ADDR,
        data: cdata,
        to:contract_address,
    };
    let gas = await web3.eth.estimateGas(tx1);
    let gasPrice = await web3.eth.getGasPrice();
    let rawTx = {
        from:PLATFORM_ETH_SIDECHAIN_ADDR,
        nonce:  nonce,
        to:contract_address,
        gas:web3.utils.toHex(gas),
        gasLimit : web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(gasPrice),
        data: cdata,
    };
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txHash = await web3.utils.sha3(serializedTx);
    console.info(txHash);
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).once('confirmation', async function(confNumber, receipt){
        console.info("Get Receipt : ",receipt)
        console.info('unlock_key',launch_key,'activity id', id)
        const [_] = await update('update ccls_activity set launch_key_raw = ?,status = ? where id = ? ', [launch_key,3,id])
    }).on('error',function (err) {
        console.info(err)
    });

    // ------------ end 4
    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}