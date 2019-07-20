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

    //-------------- 1
    var keyobj=keyth.importFromFile('0xa719ffdb0e957b41ed8aae331ccd6baa685a0d43','/Users/clark/Library/ELA_Ethereum');
    var privateKey=new Buffer(keyth.recover('elastos',keyobj),'hex');
    const nonce = await web3.eth.getTransactionCount('0xa719ffdb0e957b41ed8aae331ccd6baa685a0d43');
    console.info(web3.utils.toWei('1','ether'))
    let tx1 = {
        from: '0xa719ffdb0e957b41ed8aae331ccd6baa685a0d43',
        to: '0xe3fCa8365113Cf8F287a005471Efa77BFF0c6bCD',
        value:web3.utils.toHex(web3.utils.toWei('1','ether'))
    };
    let gas = await web3.eth.estimateGas(tx1);
    let gasPrice = await web3.eth.getGasPrice();
    let rawTx = {
        nonce:  nonce,
        gas:web3.utils.toHex(gas),
        gasLimit : web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(gasPrice),
        to: '0xe3fCa8365113Cf8F287a005471Efa77BFF0c6bCD',
        value:web3.utils.toHex(web3.utils.toWei('1','ether'))
    };
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txHash = await web3.utils.sha3(serializedTx);
    console.info(txHash);

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).once('confirmation', async function(confNumber, receipt){
        console.info("Get Receipt : ",receipt)
    }).on('error',function (err) {
        console.info(err)
    });

    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}