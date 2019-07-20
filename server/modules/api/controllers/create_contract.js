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
    let id = req.query.id;
    const [activity] = await query('select * from ccls_activity where id = ?',[id]);
    let launch_key_hash = activity[0].launch_key_hash
    let participant_num = activity[0].participant_num
    const [contracts] = await query('select * from ccls_contracts where activity_id = ? limit 1',[id]);
    let launch_block_inteval = contracts[0].launch_block_inteval
    let unlock_block_interval = contracts[0].unlock_block_interval
    const [participators] = await query('select * from ccls_participators where contract_id = ?',[contracts[0].id]);
    let participator_key_hash = []
    for(var i = 0 ; i < participators.length ; i++){
        participator_key_hash.push(participators[i].participator_key_hash)
    }
    const privateKey = new Buffer(PLATFORM_ETH_SIDECHAIN_PRIVKEY, 'hex');
    const nonce = await web3.eth.getTransactionCount(PLATFORM_ETH_SIDECHAIN_ADDR);
    const contract = new web3.eth.Contract(ETH_CONTRACT_ABI);
    let _arguments = [];
    _arguments.push(launch_key_hash)
    _arguments.push(participator_key_hash)
    _arguments.push(launch_block_inteval)
    _arguments.push(unlock_block_interval)
    _arguments.push(participant_num)
    _arguments.push([])
    console.info(_arguments)
    const data = contract.deploy({
        data: ETH_CONTRACT_BYTECODE,
        arguments:_arguments
    }).encodeABI();
    let tx1 = {
        from: PLATFORM_ETH_SIDECHAIN_ADDR,
        data: data
    };
    let gas = await web3.eth.estimateGas(tx1);
    let gasPrice = await web3.eth.getGasPrice();
    let rawTx = {
        nonce:  nonce,
        gas:web3.utils.toHex(gas),
        gasLimit : web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(gasPrice),
        data: data,
    };
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txHash = await web3.utils.sha3(serializedTx);
    console.info(txHash);

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).once('confirmation', async function(confNumber, receipt){
        console.info("Get Receipt : ",receipt)
        let txid = receipt.transactionHash
        let blockNumber = receipt.blockNumber
        let contractAddress = receipt.contractAddress
        const [activity] = await query('select * from ccls_activity where id = ?',[id]);
        let launch_key_hash = activity[0].launch_key_hash
        console.info(launch_key_hash,1111)
        const [___] = await update('update ccls_activity set status = 2 where id= ?', [id])
        const [_] = await update('update ccls_contracts set contract_address = ?,base_height=?,txid=? where activity_id= ?', [contractAddress,blockNumber,txid,id])
        const [__] = await update('update ccls_participators set contract_address = ? where contract_id= ?', [contractAddress,contracts[0].id])
        console.info("update done")
    }).on('error',function (err) {
        console.info(err)
    });

    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}