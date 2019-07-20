import {
    query,
    insert
} from 'services/db'

exports.showList = async function (req,res) {

    console.log("comet to getLockWalletList");

    let activitySql = 
    "   select                    \
            id,                   \
            name,                 \
            creator_did,          \
            creator_nickname,     \
            participant_num,      \
            status                \
        from ccls_activity        \
        order by id               ";

    var [activityRows] = await query(activitySql);

    for(let index in activityRows) {  
        console.log(index,activityRows[index]);  
        var contractsSql = 
        "   select                     \
                chain_type,            \
                token_num              \
            from ccls_contracts        ";
            
        contractsSql = contractsSql + "where activity_id = " + activityRows[index]["id"];
        const  [contractsRows] = await query(contractsSql);   
        activityRows[index]["tokens"]  = contractsRows

    };  

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: 0,
        result: activityRows
    }));

}
