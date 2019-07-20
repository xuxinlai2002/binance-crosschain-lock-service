import timers from 'timers'
import web3 from 'services/web3'
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


process.on('message', function(msg) {
    this._startTimer = function() {
        timers.setInterval(async function() {
            try {
                // 4 is status unlocked
                const [activity] = await query('select * from ccls_activity where status != 4');
                for(var i=0;i<activity.length;i++){
                    const [contracts] = await query('select * from ccls_contracts where activity_id = ? limit 1',[activity[i].id]);
                    const contract_address = contracts[0].contract_address
                    if (contract_address != null){
                        const myContract = await new web3.eth.Contract(ETH_CONTRACT_ABI,contract_address)
                        const _ = await myContract.methods.getParticipators('0x0000000000000000000000000000000000000000').call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'}, async function (error, result){
                            console.info("getParticipators",error,result);
                            if (!error){
                                console.info("tokenParticipators result ", result)
                                const [participators] = await query('select * from ccls_participators where status != 1 and  contract_id = ?',[contracts[0].id]);
                                for(var i=0;i<participators.length;i++){
                                    if(result.includes(participators[i].participator_address)){
                                        await update('update ccls_participators set status = ? where id= ?', [1,participators[i].id])
                                    }
                                }
                            }else{
                                console.info("Error calling tokenParticipators result ")
                            }
                        });


                        await myContract.methods.lockStatus().call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'}, async function (error, result){
                            if (!error){
                                console.info("LockStatus result ", result)
                                if(result == 1){
                                    const [_] = await update('update ccls_activity set status = ? where id= ?', [3,activity[i].id])
                                }else if(result == 2){
                                    const [_] = await update('update ccls_activity set status = ? where id= ?', [4,activity[i].id])
                                }else if(result == 3){
                                    // unlock eth
                                    const [rows] = await query('select * from ccls_participators where contract_id = ? and status = 1',contracts[0].id);
                                    let participators = []
                                    for(var m = 0;m<rows.length;m++){
                                        participators.push(rows[m].participator_address)
                                    }
                                    await myContract.methods.batchRelease(['0x0000000000000000000000000000000000000000',participators]).call({from: '0x8bd4ca7b65ac97f43aeb9d2e929ea65fe277890f'}, async function (error, result) {
                                        console.info("batchEthRelease result ", result)
                                    })
                                }
                            }else{
                                console.info("Error calling lockStatus result ")
                            }
                        });
                    }
                }
            } catch (err) {
                console.info("Job Task Error",err)
            }
        }, msg.interval);
    };
    this._init = function() {
        if (msg.content != null || msg.content != "" && msg.start == true) {
            this._startTimer();
        } else {
            console.log("Unable to start timer.");
        }
    }.bind(this)()
})