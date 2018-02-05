const express = require('express');
const router = express.Router();
const {getPosts} = require("../libs/crawl_lib");

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.end(await getPosts('https://chobatdongsan.com.vn/nha-dat-ban'));
});

module.exports = router;
