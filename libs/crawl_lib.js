const request = require("request").defaults({jar:true});
const cheerio = require("cheerio");
const async = require("async");
const _ = require("lodash");
const {add} = require("../controllers/c_property");

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
                getContentPost($(this).children('p').children('a').attr('href'));
            });
            return;
        })
    })
};let getAllPost = () => {
    return new Promise((resolve)=>{
        for(let i=1;i<=2947;i++){
            let option = {
                uri:`https://chobatdongsan.com.vn/nha-dat-ban/p${i}`,
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
                    getContentPost($(this).children('p').children('a').attr('href'));
                });
                return;
            })
        }
    })
};
let to_slug=(str)=>
{
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();
    str = str.trim();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '_');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
}
let getContentPost=(link)=>{
    return new Promise((resolve)=>{
        request.get(link,async ( err,res,body)=>{
            let $ = cheerio.load(body);
            let title = $('.title-main').text();
            let post = $('.pos-bds').text();
            let price = $('div.dt-price.fl > span.tahomab-gr').text();
            let acreage = $('#lands-lands > div.wrapper-maincontent > div > div.row > div.col-lg-9.col-content-bgs.cf > div.wp-price-s.cf > div.dt-s.fl > span.tahomab-gr').text();

            let description = $('.ct-dt-info-des').html();
            let keywords = $('.search-fol-key').text();
            let img = $('#imageGallery > li > img').attr('src');
            let map_x = $('#map-detail').attr('land-lat');
            let map_y= $('#map-detail').attr('land-lng');
            //detail
            let details={};
            async.each($('.tb-dt-bds>.r-dt-bds.cf'),function(e){
                let detail_name = to_slug($(e).children('.coll-dt-bds.tahoma-gr').text());
                let detail_val = _.trim($(e).children('.colr-dt-bds').text());
                details[detail_name]=detail_val;
            });
            let data = {
                _id:details['ma_so'],
                general:{
                    title,post,price,acreage,description,keywords,img
                },
                map:{
                    map_x,map_y
                },
                details
            }
            data =JSON.parse(_.replace(JSON.stringify(data),/\\t|\\n/ig,""));
            add(data,(state,result)=>{
                if(state){
                    console.log(result);
                }
            })
        })
    })
}

module.exports = {getPosts}

