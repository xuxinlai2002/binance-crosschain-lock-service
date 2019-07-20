import {
    query,
    insert
} from 'services/db'
exports.details = async function (req,res) {
    console.info(req.query)

    const blockNum = await web3.eth.getBlockNumber()
    console.info(blockNum);

    const [rows,fields] = await query('select * from test');
    console.info(rows,fields,1111);

    const [rows1,fields1] = await insert('insert into test(name) values("clark")')
    console.info(rows1,fields1,2222);

    const [rows2,fields2] = await query('select * from test');
    console.info(rows2,fields2,3333);

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: "Not Success",
        result: "get_test"
    }));
}