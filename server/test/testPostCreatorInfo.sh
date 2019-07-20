#!/usr/bin/env bash

header1="Content-type:application/json"

postdata='
{
  "name": "亦来云活动",
  "status":0,
  "launch_key_hash":"abcxxxxx",
  "creator_did":"yyyyy",
  "creator_nickname":"myName",
  "participant_num":20,
  "unlock_num":10,
  "tokens":[{
	  "chain_type": "ELA_ETH",
	  "token_num":101,
	  "launch_block_inteval":200,
	  "unlock_block_interval":1000
  },{
	  "chain_type": "ETH",
	  "token_num":102,
	  "launch_block_inteval":200,
	  "unlock_block_interval":1000
  }]
}
'

#echo $postdata
postdata=`echo $postdata | sed "s/ //g"`
#postdata=`echo $postdata | sed "s/" "/''/g"`
echo $postdata

#curl -l -H "$header" -X POST -d $postdata $url
#-X POST -H "Content-Type:application/json" \

curl http://localhost:3002/api/postCreatorInfo \
-X POST -H "Content-Type:application/json" \
-d $postdata