module.exports = {
    mysql: {
        host: '47.114.6.104', // ip地址
        user: 'root', // 数据库连接用户名
        password: '123456', // 数据库连接密码
        database: 'express-mysql-demo', // 数据库名
        port: 3306, // mysql端口号
        multipleStatements: true // 开启同时执行多条语句，貌似不太安全
    }
}