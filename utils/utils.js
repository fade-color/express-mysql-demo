module.exports.generateBookPages = function (page, totalPage, step) {
    // 将参数转为数字
    page = typeof page === 'number' ? page : parseInt(page);
    totalPage = typeof totalPage === 'number' ? totalPage : parseInt(totalPage);
    step = typeof step === 'number' ? step : parseInt(step);
    if (totalPage <= step) {
        // 总页数小于步长时
        // 1 2 3 4 5 6 7  page = 4, total = 7, step = 10
        return Array.from({length: totalPage}, (item, index) => index + 1);
    }
    if (page <= step / 2) {
        // 前几页时
        // 1 2 3 4 5 6 7 8 9 10 page <= 5, total = 20, step = 10
        return Array.from({length: step}, (item, index) => index + 1);
    }
    if (page >= totalPage - step / 2) {
        // 后几页时
        // 11 12 13 14 15 16 17 18 19 20  page >= 15, total = 20, step = 10
        return Array.from({length: step}, (item, index) => index + totalPage - step + 1);
    }
    // 其他
    // 4 5 6 7 8 9 10 11 12 13  page = 8, total = 20, step = 10
    return Array.from({length: step}, (item, index) => index + page - step / 2 + 1);
}