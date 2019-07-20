import {
    query,
    insert
} from 'services/db'

import Utils from "./utils";

exports.postCreator = async function (req,res) {

    console.log("comet to postInfo123");
    //console.log(req.body);

    let insertActivityPart = Utils.getSqlInsertForSigle(req.body);
    let insertActivitySql = 'insert into ccls_activity' + insertActivityPart[0] + " values " + insertActivityPart[1];
   
    //TODO add transaction
    let [Arows1] = await insert(insertActivitySql)
    //console.info(Arows1.insertId);

    var insertContractsPart = Utils.getSqlInsertForMultiple(req.body["tokens"]);
    insertContractsPart = Utils.pushColumAndValue(insertContractsPart,"activity_id",Arows1.insertId);
    console.info(insertContractsPart);

    let insertContractsSql = 'insert into ccls_contracts' + insertContractsPart[0] + " values " + insertContractsPart[1];

    let [Crows1] = await insert(insertContractsSql)
    //console.info(Crows1,Cfields1);

	res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
    	status:0
    }));
    
}
