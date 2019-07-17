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
    console.info(web3);
    if (typeof web3 !== 'undefined') {
        web3.eth.sendTransaction({
            to: '0x192c96bfee59158441f26101b2db1af3b07feb40',
            value: web3.toWei(1, 'ether')
        }, (err, data) => {
            if  (err) {

            } else {

            }
        })
    }
})