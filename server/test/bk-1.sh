#!/bin/bash

postJson='
{
  "name" : "亦来云活动",
  "content" : "articleContent"
}
'
#echo $postdata
postdata=`echo $postJson | sed "s/ //g"`


curl http://localhost:3002/api/postCreatorInfo \
-X POST -H "Content-Type:application/json" \
-d $postJson