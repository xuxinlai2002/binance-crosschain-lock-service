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
    const myContract = new web3.eth.Contract(ETH_CONTRACT_ABI);
    myContract.options.address = contract_address;
    await myContract.methods.launch(unlock_key).call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'},async function (error, result){
        console.info(error,result);
        if (!error){
            console.info('unlock_key',unlock_key,'activity id', id)
            const [_] = await update('update ccls_activity set launch_key_raw = ? where id = ? ', [launch_key,id])
        }
    });
    console.info(1123);

    // ------------ end 4
    res.send(JSON.stringify({
        "status":0,
        "desc":"success"
    }));
}