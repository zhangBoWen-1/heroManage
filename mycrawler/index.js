var Crawler = require("crawler");
const mysql = require('mysql')
const hm = require('mysql-ithm')



hm.connect({
    host: 'localhost', //数据库地址
    port: '3306',
    user: 'root', //用户名，没有可不填
    password: 'root', //密码，没有可不填
    database: 'herodb' //数据库名称
});

//3.创建Model(表格模型：负责增删改查)
//如果table表格存在则连接，不存在则自动创建
let heroModel = hm.model('hero', {
    name: String,
    skill: String,
    icon: String
});

var c = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ 默认为 Cheerio 解析器
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
            console.log($("title").text());
            var icon
            var skill
            var name
            var id = 1

            //姓名
            $("#hero_list  .hero-icon").siblings('a').each(function (index, item) {
                name = $(item).text()
                //上传到数据库
                heroModel.insert({
                    name
                }, (err, results) => {

                    if (!err) {
                        console.log('增加成功');

                    }
                });

            })
            //图片
            $("#hero_list  .hero-icon").children('a').children('img').each(function (index, item) {
                icon = $(item).prop('src')
                //上传到数据库
                heroModel.update(`id =${id}`, {
                    icon
                }, (err, results) => {

                    if (!err) {
                        console.log('增加成功');

                    }
                });
                id++

            })
            id = 1
            // 技能
            $("#hero_list  .tt_skill  .passive").each(function (index, item) {
                skill = $(item).text()
                heroModel.update(`id =${id}`, {
                    skill
                }, (err, results) => {

                    if (!err) {
                        console.log('增加成功');

                    }
                });
                id++


            })



        }
        done();
    }
});

// 将一个URL加入请求队列，并使用默认回调函数
// c.queue('http://wiki.joyme.com/cq');
c.queue({
    uri: "http://wiki.joyme.com/cq/%E9%AA%91%E5%A3%AB",

});

// 将多个URL加入请求队列
// c.queue(['http://www.google.com/','http://www.yahoo.com']);

// 对单个URL使用特定的处理参数并指定单独的回调函数
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,

//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

// 将一段HTML代码加入请求队列，即不通过抓取，直接交由回调函数处理（可用于单元测试）
// c.queue([{
//     html: '<p>This is a <strong>test</strong></p>'
// }]);