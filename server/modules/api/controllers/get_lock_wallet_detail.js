import {
    query,
    insert
} from 'services/db'

exports.showDetail = async function (req,res) {

    console.log("comet to showDetail");
    let activityID = req.query["activity"];
    var activitySql = 
    "   select *                  \
        from ccls_activity        \
        where id =                ";
    var activitySql = activitySql + activityID;
    var [activityRows] = await query(activitySql);

    for(let index in activityRows) {  
        console.log(index,activityRows[index]);  
        var contractsSql = " select * from ccls_contracts ";
        contractsSql = contractsSql + "where activity_id = " + activityRows[index]["id"];
        const  [contractsRows] = await query(contractsSql);   
        activityRows[index]["tokens"]  = contractsRows

        for(let cIndex in contractsRows){
            var participatorSql = "select * from ccls_participators where contract_id = " + contractsRows[cIndex].id;
            const [paticipatorRows] = await query(participatorSql);   
            activityRows[index]["tokens"][cIndex]["paticipators"]  = paticipatorRows
        }

    };  

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: 0,
        result: activityRows[0]
    }));
    
}
