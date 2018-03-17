const mongoose = require("mongoose");
require("../models/m_property");

let PROP = mongoose.model('property');

let add = (data,cb)=>{
    let prop = new PROP(data);
    PROP.findOne({_id:data._id}).then(res=>{
        if(!res){
            prop.save().then((res)=>{
                if (res) {
                    cb(true, res);
                } else {
                    cb(false, res);
                }
            })
        } else {
            cb(false, 'trung du lieu');
            console.log("Trung du lieu")
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