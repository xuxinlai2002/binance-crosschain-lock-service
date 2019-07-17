exports.details = function(req,res){
	let {
		id,
		name
	} = req.body
	console.info(id,name);
	res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
    	status:"Success",
    	result:"post_test"
    }));
}