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
    var rand_l = 0, rand_r = constantpkg.ONE_MIN * 2;
    var extra = random(rand_l, rand_r) * random(0, 5);
    var res = constantpkg.NORMAL_SLEEP_TIME + extra;
    return res;
}


/**
 * 根据描述值 点击
 * @param energyType
 * @param noFindExit
 */
function clickByDesc(energyType, paddingY, noFindExit, exceptionMsg) {
    if (descEndsWith(energyType).exists()) {
        descEndsWith(energyType).find().forEach(function(pos) {
            var posb = pos.bounds();
            click(posb.centerX(), posb.centerY() - paddingY);
            timepkg.mysleep(constantpkg.SEC_2);
        });
    } else {
        if (noFindExit != null && noFindExit) {
            if (exceptionMsg != null) {
                throwException(exceptionMsg);
            } else {
                throwException("clickByDesc错误");
            }
        }
    }
}

/**
 * 根据text值 点击 * @param energyType * @param noFindExit
 */
function clickByText(energyType, noFindExit, exceptionMsg) {
    if (textEndsWith(energyType).exists()) {
        textEndsWith(energyType).find().forEach(function(pos) {
            var posb = pos.bounds();
            click(posb.centerX(), posb.centerY() - 60);
        });
    } else {
        if (noFindExit != null && noFindExit) {
            if (exceptionMsg != null) {
                throwException(exceptionMsg)
            } else {
                throwException("clickByText错误");
            }
        }
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
