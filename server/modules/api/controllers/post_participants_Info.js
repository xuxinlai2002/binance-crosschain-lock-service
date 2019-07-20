import {
    query,
    insert
} from 'services/db'

import Utils from "./utils";

exports.postParticipant = async function (req,res) {

    console.log("comet to participator postInfo");
    console.log(req.body);


    let selContractsId = "select id from ccls_contracts where activity_id = " 
                        + req.body["activity_id"] 
                        + " and chain_type = " 
                        + "\"" + req.body["token_type"] +"\"";

    var [activityRows] = await query(selContractsId);     
    
    let insertParticipantsSql = "insert into ccls_participators " 
                        + "(contract_id,participator_did,participator_nickname,token_type,token_num,participator_key_hash) values("
                        + "\"" + activityRows[0]["id"] + "\","
                        + "\"" + req.body["participator_did"] + "\","
                        + "\"" + req.body["participator_nickname"] + "\","
                        + "\"" + req.body["token_type"] + "\","
                        + req.body["token_num"] + ","
                        + "\"" + req.body["participator_key_hash"] + "\")"

    let [Arows1] = await insert(insertParticipantsSql)

	res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
    	status:0
    }));
    
}
