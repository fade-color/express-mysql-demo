var express = require('express');
var utils = require('../utils/utils')
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

/* 获取用户列表（分页查询） */
router.get('/books', function(req, res, next) {
  pool.getConnection(function (err,connection) {
    if (err)
      throw err;
    // 获取前台页面传入的参数
    var param = req.query || req.params;
    var page = parseInt(param.page) || 1; // 当前页数，默认第1页
    var num = parseInt(param.num) || 20; // 每页的数据个数，默认20条
    // 建立连接
    connection.query(userSQL.queryBooks, [num, (page - 1) * num], function (err, result) {
      if (result) {
        var totalCount = parseInt(result[0][0]['COUNT(*)']); // 总条数
        var totalPage = Math.ceil(totalCount / num); // 总页数，向上取整
        var currentPage = page;
        var isFirstPage = currentPage == 1;
        var isLastPage = currentPage == totalPage;
        var adjacentPage = utils.generateBookPages(currentPage, totalPage, 10); // 相邻页码，只显示相邻10页
        var bookList = result[1]; // 数据
        res.json({
          code: 100,
          msg: '处理成功',
          totalCount: totalCount,
          totalPage: totalPage,
          currentPage: currentPage,
          isFirstPage: isFirstPage,
          isLastPage: isLastPage,
          adjacentPage: adjacentPage,
          bookList: bookList
        })
      } else {
        responseJSON(res, result);
      }
      // 释放连接
      connection.release();
      if (err)
        throw err;
    });
  });
});

module.exports = router;
