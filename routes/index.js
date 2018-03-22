const express = require('express');
const router = express.Router();
const {getPosts,getAllPost} = require("../libs/crawl_lib");
const {get} = require('../controllers/c_property');

/* GET home page. */
router.get('/', async function (req, res, next) {
    
    for (let i = 0; i <= 47601; i++){
        await getPosts('https://chobatdongsan.com.vn/nha-dat-ban' + '/p' + i);
    }
    res.end("Geting");
});
router.get('/get',(req,res)=>{
    get(0,20,(status,results)=>{
        if(status){
            res.json(results);
        }
    })
})
router.get('/getall',(req,res)=>{
    getAllPost();
})

module.exports = router;
