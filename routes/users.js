var express = require('express');
var router = express.Router();

// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/usersql');

// 使用DBConfig.js的配置信息创建一个连接池
var pool = mysql.createPool(dbConfig.mysql);

// 响应一个json数据
var responseJSON = function (res, ret) {
  if (!ret) { // 如果ret为undefined
    res.json({
      code: 200,
      msg: '操作失败'
    });
  } else {
    res.json({
      code: 100,
      msg: '操作成功',
      data: ret
    });
  }
}

// 添加用户
router.get('/addUser', (req, res, next) => {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传入的参数
    var param = req.query || req.params;
    // 建立连接，增加一个用户信息
    connection.query(userSQL.insert, [param.id, param.name, param.sex], function (err, result) {
      // 如果发生错误，result即为undefined
      // 受影响的行数通过result.affectedRows获取
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});

/* 获取用户列表 */
router.get('/', function(req, res, next) {
  pool.getConnection(function (err,connection) {
    // 建立连接
    connection.query(userSQL.queryAll, [], function (err, result) {
      // 如果发生错误，result即为undefined
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});

// 根据id查找用户
router.get('/findUser', function(req, res, next) {
  pool.getConnection(function (err,connection) {
    // 获取前台页面传入的参数
    var param = req.query || req.params;
    // 建立连接
    connection.query(userSQL.getUserById, [param.id], function (err, result) {
      // 如果发生错误，result即为undefined
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});

module.exports = router;
