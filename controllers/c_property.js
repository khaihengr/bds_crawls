const mongoose = require("mongoose");
require("../models/m_property");

let PROP = mongoose.model('property');

let add = (data,cb)=>{
    let prop = new PROP(data);
    PROP.findOne({_id:data._id}).then(res=>{
        if(!res){
            console.log(res);
            console.log(data);
            prop.save().then((res)=>{

                if (res) {
                    cb(true, res);
                } else {
                    cb(false, res);
                }
            })
        }
    })
}
let get = (skip,limit,cb)=>{
    PROP.find({}).skip(skip).limit(limit).then((res)=>{
        if(res){
            cb(true,res);
        }else{
            cb(false,null);
        }
    })
}
module.exports={
    get,add
}