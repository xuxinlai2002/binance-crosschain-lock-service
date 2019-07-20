"use strict";

class Utils {


  static getSqlInsertForSigle(orgData){

    var colums = "";
    var values = "";

    for ( let key of Object.keys(orgData)){

        if(!Array.isArray(orgData[key])){
            colums += key + ","
            values += "\"" + orgData[key] +"\"" + ","
        }
    }
    let ret = [Utils.formatSql(colums),Utils.formatSql(values)]
    return ret;
  }  

  static getSqlInsertForMultiple(orgData){

    var colums = "";
    var values = new Array();
    for(let item of orgData) {
        let sigle = this.getSqlInsertForSigle(item);
        colums = sigle[0];
        values.push(sigle[1])
    }
    return [colums,values]

  }

  static pushColumAndValue(orgData,column,value){

    var newValues = new Array();
    let newColumn = this.addSingleData(orgData[0],column)
    for(let item of orgData[1]) {
        newValues.push(this.addSingleData(item,value))
    }   
    return [newColumn,newValues];
 }

  static addSingleData(paramData,data){

    let retStr = paramData.substring(0,paramData.length-1)
    return retStr + "," + data + ")" 

  }


  static formatSql(orgStr){

    let retStr = orgStr.substring(0,orgStr.length-1)
    return "(" + retStr + ")"

}


}

module.exports = Utils;
