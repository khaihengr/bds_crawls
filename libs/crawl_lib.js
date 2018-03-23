'use strict'
const request = require("request").defaults({ jar: true });
const cheerio = require("cheerio");
const async = require("async");
const _ = require("lodash");
const { add } = require("../controllers/c_property");
const moment = require("moment");
const conn = require('../database/mysql');
// conn.test_conn();


let cities = ['An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Phú Yên', 'Cần Thơ', 'Đà Nẵng', 'Hải Phòng', 'Hà Nội', 'TP HCM'];
let categories = ['Bán căn hộ chung cư', 'Bán kho, nhà xưởng, đất công nghiệp', 'Bán loại bất động sản khác', 'Bán nhà biệt thự', 'liền kề, phân lô', 'Bán nhà mặt phố', 'Bán nhà riêng', 'Bán sàn văn phòng thương mại', 'Bán trang trại', 'khu nghỉ dưỡng', 'Bán đất', 'Bán đất nền dự án'];
let units = ['Thỏa thuận', 'Triệu', 'Tỷ', 'Trăm nghìn/m2', 'Triệu/m2'];
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
            resolve("ok");
            // console.log("done!");
            return;
        })
    })
};
let getAllPost = () => {
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
            let postion = $('.pos-bds').text();
            let price = $('div.dt-price.fl > span.tahomab-gr').text();
            let acreage = $('#lands-lands > div.wrapper-maincontent > div > div.row > div.col-lg-9.col-content-bgs.cf > div.wp-price-s.cf > div.dt-s.fl > span.tahomab-gr').text();

            let description = $('.ct-dt-info-des').html();
            let keywords = $('.search-fol-key').text();
            let img = $('#imageGallery > li.lslide.active > img').attr('src');
            let map_x = $('#map-detail').attr('land-lat');
            let map_y= $('#map-detail').attr('land-lng');
            //detail
            let details = {
                dia_chi: "",
                loai_tin_rao: "",
                ngay_dang_tin: "",
                ngay_het_han: "",
                so_tang: "",
                so_phong_ngu: "",
                so_toilet: "",
                ten_lien_lac: "",
                so_nha_de_xe:"",
                dien_thoai: "",
                email: "",
                huong_nha: "",
                huong_ban_cong: "",
                duong_vao: "",
                mat_tien: "",
                so_toilet: "",
                noi_that: "",
                dien_thoai: "",
                di_dong: "",
                
            };
            async.each($('.tb-dt-bds>.r-dt-bds.cf'),function(e){
                let detail_name = to_slug($(e).children('.coll-dt-bds.tahoma-gr').text());
                let detail_val = _.trim($(e).children('.colr-dt-bds').text());
                details[detail_name]=detail_val;
            });
            let imgs = [];
            async.each($('#imageGallery img'),function(e){
                imgs.push($(e).attr('src'));
            });
            let data = {
                _id:details['ma_so'],
                general:{
                    title,postion,price,acreage,description,keywords,img,imgs
                },
                map:{
                    map_x,map_y
                },
                details
            }
            let re = new RegExp(/([a-zA-Z][a-zA-Z\sZ_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+)$/, "g");
            let area = new RegExp(/^(\d+)/, "g").exec(acreage)[0];
            if (Number.isNaN(parseInt(area))){
                area = 0;
            }
            let place = (re.exec(postion)[0]).trim();
            let place_id = cities.indexOf(place) + 1;
            let dis_re = new RegExp(/-\s(.+)\s-/, "g");
            let district = dis_re.exec(postion)[1].trim();
            district = _.replace(district, /Q. |Tx. |H. /, "");
            let query_s = `Select _id from place where _parent=${place_id} and value like \"%${district}%\"`;
            conn.query(query_s).then(res => {
                let dis_id=0;
                try {
                    dis_id= JSON.parse(JSON.stringify(res))[0]._id;
                } catch (e){
                    dis_id = place_id;
                }
                let project_owner = 1;
                let form = 2;
                let category_id = categories.indexOf(details['loai_tin_rao']) + 21;
                let re_u = new RegExp(/\s(.+)$/, "g").exec(price)[1];
                let price_c = new RegExp(/^(\d+)/, "g").exec(price)[0];
                let unit = units.indexOf(re_u) != -1 ? units.indexOf(re_u) : 0;
                let address = details['dia_chi'];
                let created_date = moment(details['ngay_dang_tin'], "DD/MM/YYYY").format('YYYY-MM-DD h:mm:ss');
                let expiry_date = moment(details['ngay_het_han'], "DD/MM/YYYY").format('YYYY-MM-DD h:mm:ss');
                let postion_x = map_x;
                let postion_y = map_y;
                let floor_num = details['so_tang'];
                let gara_num = details['so_nha_de_xe'];
                let bed_room_num = details['so_phong_ngu'];
                let front = details['mat_tien'];
                let toilet_num = details['so_toilet'];
                let furniture = details['noi_that'];
                let house_facing = details['huong_nha'];
                let from_road = details['duong_vao'];
                let balcony_facing = details['huong_ban_cong'];
                let contact_email = details['email'];
                let contact_name = details['ten_lien_lac'];
                let contact_phone = details['dien_thoai'];
                let image = "";
                if (imgs.length > 0) {
                    for (var i = 0; i < imgs.length; i++)image += imgs[i] + ',';
                }
                let u_query = `insert into contact (name,phone,email) values (?,?,?)`;
                conn.query(u_query, [contact_name, contact_phone, contact_email]).then(res => {
                    // console.log(res)
                    if (res) {
                        let contact_id = res.insertId;
                        let s_query = `insert into sale_lease_post (title,project_owner,form,place_id,category_id,area,image,unit,address,description,front,house_facing,balcony_facing,floor_num,bed_room_num,furniture,toilet_num,gara_num,postion_x,postion_y,contact_id,price,created_date,expiry_date,from_road) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                        conn.query(s_query,[ title,project_owner,form,dis_id,category_id,area,image,unit,address,description,front,house_facing,balcony_facing,floor_num,bed_room_num,furniture,toilet_num,gara_num,postion_x,postion_y,contact_id,price,created_date,expiry_date,from_road]).then(res => {
                            console.log(res);
                        }).catch(e => {
                            // console.log(e)
                        })
                        
                    }
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                let project_owner = 1;
                let form = 1;
                let category_id = categories.indexOf(details['loai_tin_rao']) + 21;
                let re_u = new RegExp(/\s(.+)$/, "g").exec(price)[1];
                let price_c = new RegExp(/^(\d+)/, "g").exec(price)[0];
                let unit = units.indexOf(re_u) != -1 ? units.indexOf(re_u) : 0;
                let address = details['dia_chi'];
                let created_date = moment(details['ngay_dang_tin'], "DD/MM/YYYY").format('YYYY-MM-DD h:mm:ss');
                let expiry_date = moment(details['ngay_het_han'], "DD/MM/YYYY").format('YYYY-MM-DD h:mm:ss');
                let postion_x = map_x;
                let postion_y = map_y;
                let floor_num = details['so_tang'];
                let gara_num = details['so_nha_de_xe'];
                let bed_room_num = details['so_phong_ngu'];
                let front = details['mat_tien'];
                let toilet_num = details['so_toilet'];
                let furniture = details['noi_that'];
                let house_facing = details['huong_nha'];
                let from_road = details['duong_vao'];
                let balcony_facing = details['huong_ban_cong'];
                let contact_email = details['email'];
                let contact_name = details['ten_lien_lac'];
                let contact_phone = details['dien_thoai'];
                let image = "";
                if (imgs.length > 0) {
                    for (var i = 0; i < imgs.length; i++)image += imgs[i] + ',';
                }
                let u_query = `insert into contact (name,phone,email) values (?,?,?)`;
                conn.query(u_query, [contact_name, contact_phone, contact_email]).then(res => {
                    // console.log(res)
                    if (res) {
                        let contact_id = res.insertId;
                        let s_query = `insert into sale_lease_post (title,project_owner,form,place_id,category_id,area,image,unit,address,description,front,house_facing,balcony_facing,floor_num,bed_room_num,furniture,toilet_num,gara_num,postion_x,postion_y,contact_id,price,created_date,expiry_date,from_road) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                        conn.query(s_query,[ title,project_owner,form,place_id,category_id,area,image,unit,address,description,front,house_facing,balcony_facing,floor_num,bed_room_num,furniture,toilet_num,gara_num,postion_x,postion_y,contact_id,price,created_date,expiry_date,from_road]).then(res => {
                            console.log(res);
                            
                        }).catch(e => {
                            // console.log(e)
                        })
                        
                    }
                }).catch(e => {
                    console.log(e)
                })
            })

            
            // data= JSON.parse(_.replace(JSON.stringify(data),/\\t|\\n/ig,""));
            // add(data,(state,result)=>{
            //     if(state){
            //         console.log(state.general.title + "was added");
            //     }
            // })
        })
    })
}

module.exports = {getPosts}

