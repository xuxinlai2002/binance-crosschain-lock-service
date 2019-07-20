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

exports.details = async function (req,res) {

    // // ----------- 0
    let unlock_key = req.query.unlock_key
    let id = req.query.id
    let participator_did = req.query.paticipator_did
    const [contracts] = await query('select * from ccls_contracts where activity_id = ? limit 1',[id]);
    let contract_address = contracts[0].contract_address
    const myContract = new web3.eth.Contract(ETH_CONTRACT_ABI);
    myContract.options.address = contract_address;
    console.info(contract_address)
    // myContract.methods.unlock(unlock_key).call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'}, async function (error, result){
    //     console.info(error,result);
    //     if (!error){
    //         console.info('unlock_key',unlock_key,'activity id', id)
    //         const [_] = await update('update ccls_participators set participator_key_raw = ?,status = 2 where paticipator_did= ? and contract_id = ?', [unlock_key,paticipator_did,contracts[0].id])
    //         const [__] = await update('update ccls_activity set unlock = ifnull(unlock,0) + 1 where id = ? ', [id])
    //     }
    // });

    const privateKey = new Buffer(PLATFORM_ETH_SIDECHAIN_PRIVKEY, 'hex');
    const nonce = await web3.eth.getTransactionCount(PLATFORM_ETH_SIDECHAIN_ADDR);
    const contract = new web3.eth.Contract(ETH_CONTRACT_ABI,contract_address);
    const cdata = contract.methods.unlock(unlock_key).encodeABI()

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
        console.info('unlock_key',unlock_key,'activity id', id)
        const [_] = await update('update ccls_participators set participator_key_raw = ?,status = 2 where participator_did= ? and contract_id = ?', [unlock_key,participator_did,contracts[0].id])
        const [__] = await update('update ccls_activity set unlock_num = ifnull(unlock_num,0) + 1 where id = ? ', [id])
    }).on('error',function (err) {
        console.info(err)
    });

    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}