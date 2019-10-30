// mysql模块
const mysql = require('mysql');
// hm模块
const hm = require('mysql-ithm');

//2.连接数据库
//如果数据库存在则连接，不存在则会自动创建数据库
hm.connect({
    host: 'localhost', //数据库地址
    port: '3306',
    user: 'root', //用户名，没有可不填
    password: 'root', //密码，没有可不填
    database: 'db88' //数据库名称
});

//3.创建Model(表格模型：负责增删改查)
//如果table表格存在则连接，不存在则自动创建
let manModel = hm.model('man', {
    name: String,
    skill: String,
    manid:String
  
});


// 使用 Mock
var Mock = require('mockjs')
var Random = Mock.Random

for (let i = 0; i < 10; i++) {
    const name =Random.cname()
    const skill = Random.csentence(5, 8)
    const manid =Random.id()
    // 输出结果
    const obj = {
        name,
        manid,
        skill
    }
    console.log(obj);
    
    manModel.insert(obj,(err,results)=>{
        // console.log(err);
        // console.log(results);

        
    });
    
    
}