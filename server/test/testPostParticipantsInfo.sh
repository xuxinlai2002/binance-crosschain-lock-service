#!/usr/bin/env bash

header1="Content-type:application/json"

postdata='
{
  "activity_id": "1",
  "participator_did":"111",
  "participator_nickname":"myxx",
  "token_type":"ETH",
  "token_num":10,
  "participator_key_hash":"hash123456"
}
'

#echo $postdata
postdata=`echo $postdata | sed "s/ //g"`
#postdata=`echo $postdata | sed "s/" "/''/g"`
echo $postdata

#curl -l -H "$header" -X POST -d $postdata $url
#-X POST -H "Content-Type:application/json" \

curl http://localhost:3002/api/postParticipantsInfo \
-X POST -H "Content-Type:application/json" \
-d $postdata