const request = require("request").defaults({jar:true});
const cheerio = require("cheerio");
const _ = require("lodash");

let getPosts = (link) => {
    return new Promise((resolve)=>{
        let option = {
            uri:'https://chobatdongsan.com.vn/nha-dat-ban',
            header:{
                'Origin':'https://chobatdongsan.com.vn',
                'Upgrade-Insecure-Requests':'1',
                'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryB3BhV9wqgAqEnOSR',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36',
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Referer':'https://chobatdongsan.com.vn/nha-dat-ban',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'en,vi;q=0.9',
                'Cookie':'__zlcmid=kjh5ILCtsF5swS; PHPSESSID=hkp6b3oh0m572bejrpl0j1csf2; 11'
            },
            form:{
                filter:1
            }
        }
        request.post(option,(err,res,body)=>{
            let $ = cheerio.load(body);
            let posts = $(".item-bdss").each(function(i,e){
                $(this).children('p').children('a').attr('href');
            })
        })
    })
};

let getContentPost=(link)=>{
    return new Promise((resolve)=>{
        request.get(link,(err,res,body)=>{
            let $ = cheerio.load(body);
            let title = $('.title-main').text();
            let post = $('.pos-bds').text();
            let price = $('div.dt-price.fl > span.tahomab-gr').text();
            let acreage = $(' div.dt-price.fl span.tahomab-gr:nth-child(2)').text();
        })
    })
}
module.exports = {getPosts}

