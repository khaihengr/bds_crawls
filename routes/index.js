const express = require('express');
const router = express.Router();
const {getPosts,getAllPost} = require("../libs/crawl_lib");
const {get} = require('../controllers/c_property');

/* GET home page. */
router.get('/lease', async function (req, res, next) {
    setInterval(async function() {
        for (let i =10; i >=0 ; i--){
            await getPosts('https://chobatdongsan.com.vn/nha-dat-cho-thue/p' + i,2);
        }
    },86400000);
    res.end("Geting");
});

router.get('/sale', async function (req, res, next) {
    setInterval(async function () {
        for (let i = 10; i >= 0; i--) {
            await getPosts('https://chobatdongsan.com.vn/nha-dat-ban/p' + i, 1);
        }
    }, 86400000);
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
