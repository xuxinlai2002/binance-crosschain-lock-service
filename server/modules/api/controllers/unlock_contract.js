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
    let paticipator_did = req.query.paticipator_did
    const [contracts] = await query('select * from ccls_contracts where activity_id = ? limit 1',[id]);
    let contract_address = contracts[0].contract_address
    const myContract = new web3.eth.Contract(ETH_CONTRACT_ABI);
    myContract.options.address = contract_address;
    console.info(contract_address)
    myContract.methods.unlock(unlock_key).call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'}, async function (error, result){
        console.info(error,result);
        if (!error){
            console.info('unlock_key',unlock_key,'activity id', id)
            const [_] = await update('update ccls_participators set participator_key_raw = ? where paticipator_did= ? and contract_id = ?', [unlock_key,paticipator_did,contracts[0].id])
        }
    });

    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}