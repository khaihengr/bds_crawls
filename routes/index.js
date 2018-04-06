const express = require('express');
const router = express.Router();
const {getPosts,getAllPost} = require("../libs/crawl_lib");
const {get} = require('../controllers/c_property');

/* GET home page. */
// rule=menual | rule = auto
router.get('/lease', async function (req, res, next) {
    res.status(200).send('data is getting');
    
    let lease_interval = setInterval(async function () {
        for (let i = 10; i >= 0; i--) {
            await getPosts('https://chobatdongsan.com.vn/nha-dat-cho-thue/p' + i, 2);
        }
    }, 28800000);
    if (req.query.rule&&req.query.rule === "manual") {
        try {
            clearInterval(lease_interval);
            console.log("CLEAR")
            for (let i = 10; i >= 0; i--) {
                await getPosts('https://chobatdongsan.com.vn/nha-dat-cho-thue/p' + i, 2);
            }
            
        }catch(err){
            for (let i = 10; i >= 0; i--) {
                await getPosts('https://chobatdongsan.com.vn/nha-dat-cho-thue/p' + i, 2);
            }
        }
    }
});

router.get('/sale', async function (req, res, next) {
    res.status(200).send('data is getting');
    let sale_interval = setInterval(async function () {
        for (let i = 10; i >= 0; i--) {
            await getPosts('https://chobatdongsan.com.vn/nha-dat-ban/p' + i, 1);
        }
    }, 28800000);
    
    if (req.query.rule&&req.query.rule === "manual") {
        try {
            clearInterval(sale_interval);
            console.log("CLEAR")
            for (let i = 10; i >= 0; i--) {
                await getPosts('https://chobatdongsan.com.vn/nha-dat-ban/p' + i, 1);
            }
        }catch(err){
            for (let i = 10; i >= 0; i--) {
                await getPosts('https://chobatdongsan.com.vn/nha-dat-ban/p' + i, 1);
            }
        }
    }
});
router.get('/get',(req,res)=>{
    get(0,20,(status,results)=>{
        if(status){
            res.json(results);
        }
    })
})

module.exports = router;
