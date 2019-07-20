import get from 'modules/api/controllers/test_get'
import post from 'modules/api/controllers/test_post'

// import post from 'modules/api/controllers/create_contract'

import lockWalletList from 'modules/api/controllers/get_lock_wallet_list'
import lockWalletDetail from 'modules/api/controllers/get_lock_wallet_Detail'
import creatorInfo from 'modules/api/controllers/post_creator_info'
import participantsInfo from 'modules/api/controllers/post_participants_info'

export default app => {
    app.get('/get',get.details);
    app.post('/post',post.details);

    app.get('/getLockWalletList',lockWalletList.showList);
    app.get('/getLockWalletDetail',lockWalletDetail.showDetail);
    app.post('/postCreatorInfo',creatorInfo.postCreator);
    app.post('/postParticipantsInfo',participantsInfo.postParticipant);

    app.get('/test', function(req, res) {
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>e
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    1212121
    <button id='test'>111</button>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">
$(()=>{
    window.addEventListener('load', function() {
          // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3 = new Web3(web3.currentProvider);
          } else {
            console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
          }
        });
})

    
</script>
    
<script>
$(()=>{
  if (typeof web3 !== 'undefined') {
    // $('#test').click(()=>{
      web3.eth.sendTransaction({
        to: '0x192c96bfee59158441f26101b2db1af3b07feb40',
        value: web3.toWei(1, 'ether')
      }, (err, data) => {
        if  (err) {
        } else {
        }
      })
    // }) 
  }
})
</script>
<script>
</script>
</html>`)
    })
    app.get('/', function (req, res) {
        res.render('index', { title: 'Hey', message: 'Hello there!' })
    });
}
