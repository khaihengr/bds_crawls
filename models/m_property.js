let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let property_Schame = new Schema({
    _id:String,
    general:{
        title:String,post:String,price:String,acreage:String,description:String,keywords:String,img:String
    },
    map:{
        map_x:String,
        map_y:String
    },
    details:{

    }
})
mongoose.model('property',property_Schame);
