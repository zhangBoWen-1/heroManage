const express = require('express')
const app = express()
//导入中间件
const bodyp = require('body-parser')
const fileupload = require('express-fileupload')
const path = require('path')
//导入模块
// mysql模块
const mysql = require('mysql');
// hm模块
const hm = require('mysql-ithm');
//跨域----------------------------------------------------------
app.use((request,response,next)=>{
    // 设置允许跨域
    response.header('Access-Control-Allow-Origin', '*');
    next()
})
//静态资源托管--------------------------------------------------------
//托管web页面 调用即可同源
app.use(express.static('web'))
//托管图片文件夹
app.use(express.static('uplouds'))
// 调用中间件-------------------------------------------------------
app.use(bodyp.urlencoded({
    extended: false
}));
app.use(fileupload());
//----------------------------------------------------------------


//2.连接数据库
//如果数据库存在则连接，不存在则会自动创建数据库
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




//4.调用API：添加数据
// heroModel.insert({ name:"String",skill:"String",icon:"String"},(err,results)=>{
//     console.log(err);
//     console.log(results);
//     if(!err) console.log('增加成功');
// });



//4.设计路由（接口文档）

//(1)查询英雄列表
app.get('/hero/list', (req, res) => {

    heroModel.find((err, results) => {
        if (!err) {
            console.log(results);
            res.send({
                heros: results
            })
        } else {
            res.send({
                code: 500,
                msg: '服务器内部错误'
            })
        }
    })
});

//(2)查询英雄详情
app.get('/hero/info', (req, res) => {
    const id = req.query.id
    heroModel.find(`id=${id}`, (err, results) => {
        console.log(results);

        if (!err) {
            if (results.length == 0) {
                res.send({
                    msg: '参数有误请检查'
                })
            } else {
                res.send({
                    data: results[0]
                })
            }

        } else {
            res.send({
                code: 500,
                msg: '服务器内部错误'
            })
        }

    })


});

//(3)编辑英雄
app.post('/hero/update', (req, res) => {
    console.log(req.files);
    
    //获取数据
    const {
        id,
        name,
        skill
    } = req.body
    const icon = req.files.icon.name
    //移动文件
    req.files.icon.mv(path.join(__dirname,'./uplouds',icon),(err,results)=>{
        if (!err) {
            console.log('修改英雄图片保存成功');
            
        }
    } )
    //修改数据库
    heroModel.update(`id=${id}`,{name,skill,icon},(err,results)=>{
        if (!err) {
            res.send({
                code:200
            })
        }else{
            res.send({
                code:500,
                msg:'服务器内部错误'
            })
        }
    });

});

//(4)删除英雄
app.post('/hero/delete', (req, res) => {
    const id = req.body.id;
    heroModel.delete(`id=${id}`,(err,results)=>{
        if (!err) {
            res.send({
                code:200,
                msg:'删除成功'
            })
        }else{
            res.send({
                code:500,
                msg:'服务器内部错误'
            })
        }
    });

});
   
//(5)新增英雄
app.post('/hero/add', (req, res) => {
    //获取数据
    const {name,skill} =req.body
    const icon = req.files.icon.name
    //移动图片
    req.files.icon.mv(path.join(__dirname,'./uplouds',icon),(err,results)=>{
        if (!err) {
            console.log('新增英雄图片保存成功');
            
        }
    })
    //数据库新增
    heroModel.insert({name,skill,icon},(err,results)=>{
        
        if(!err) {
            res.send({
                code:200
            })
        }else{
            res.send({
                code:500,
                msg:'后台出错'
            })
        }
    });


});


app.listen(3000, err => {
    if (!err) {
        console.log('success');

    }
})