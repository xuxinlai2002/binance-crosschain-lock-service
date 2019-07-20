import get from 'modules/api/controllers/test_get'
import post from 'modules/api/controllers/test_post'
import create_contract from 'modules/api/controllers/create_contract'
import unlock_contract from 'modules/api/controllers/unlock_contract'
import transfer_contract from 'modules/api/controllers/transfer_contract'
import launch_contract from 'modules/api/controllers/launch_contract'
import recharge_callback from 'modules/api/controllers/recharge_callback'

export default app => {
    // demo
    app.get('/get',get.details);
    app.post('/post',post.details);
    app.get('/', function (req, res) {
        res.render('index', { title: 'Hey', message: 'Hello there!' })
    });

    // for real
    // create contract
    app.get("/v1/contract/create",create_contract.details);
    // launch contract
    app.get("/v1/contract/launch",launch_contract.details);
    // join contract
    // app.get("/v1/contract/transfer",transfer_contract.details);
    // unlock contract
    app.get("/v1/contract/unlock",unlock_contract.details);
    // p
    app.post("/v1/contract/recharge/callBack",recharge_callback.details);

}
