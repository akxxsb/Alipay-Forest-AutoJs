// 抛出异常，停止本轮操作
var timepkg = require('./time.js');
var constantpkg = require('./constant.js');

function throwException(err_msg) {
    toastLog(err_msg);
    throw Error(err_msg);
}


// 检查是不是早上
function isMorningTime() {
    var now = new Date();
    var hour = now.getHours();
    var minu = now.getMinutes();
    if (hour == 6 && minu >= 50) {
        return true;
    }
    if (hour == 7 && minu <= 50) {
        return true;
    }
    return false;
}


function getSleepTime() {
    if (isMorningTime()) {
        return constantpkg.MORNING_SLEEP_TIME;
    }
    var res = constantpkg.NORMAL_SLEEP_TIME;
    return res;
}


function clickByDesc(desc, adjustY, noFindExit, err_msg) {
    var w = selector().descEndsWith(desc).find();
    if (!w.empty()) {
        w.forEach(function(item) {
            var b = item.bounds();
            click(b.centerX(), b.centerY());
        });
    } else {
        err_msg = err_msg ? err_msg : "clickByDesc error";
        func = noFindExit ? throwException : toastLog;
        func(err_msg);
    }
}


function clickByText(text, noFindExit, err_msg) {
    var w = selector().textEndsWith(text).find();
    if (!w.empty()) {
        w.forEach(function(item) {
            var b = item.bounds();
            click(b.centerX(), b.centerY());
        });
    } else {
        err_msg = err_msg ? err_msg : "clickByText error";
        func = noFindExit ? throwException : toastLog;
        func(err_msg);
    }
}


function checkNeedRun() {
    var now = new Date();
    var hour = now.getHours();
    var minu = now.getMinutes();
    if (hour >= 22) {
        return false;
    }
    if (hour > 0 && hour < 6) {
        return false;
    }
    if (hour == 6 & minu < 30) {
        return false;
    }
    return true;
}


module.exports = {
    throwException: throwException,
    isMorningTime: isMorningTime,
    getSleepTime: getSleepTime,
    clickByDesc: clickByDesc,
    clickByText: clickByText,
    checkNeedRun: checkNeedRun,
};
