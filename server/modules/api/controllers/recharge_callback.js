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

    let participator_did = req.body['participator_did']
    let participator_address = req.body['participator_address']
    let contract_address = req.body['contract_address']
    let txid = req.body['txid']
    console.info(participator_did,participator_address,contract_address)
    const [row,field] = await update('update ccls_participators set participator_address = ? , recharge_txid = ? where paticipator_did= ? and contract_address = ?',
        [participator_address,txid,participator_did,contract_address])
    console.info(row,field)
    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}