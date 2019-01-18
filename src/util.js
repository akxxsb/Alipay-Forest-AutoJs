// 抛出异常，停止本轮操作
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
        return MORNING_SLEEP_TIME;
    }
    return NORMAL_SLEEP_TIME;
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
            time.mysleep(constant.SEC_2);
        });
    } else {
        if (noFindExit != null && noFindExit) {
            if (exceptionMsg != null) {
                util.throwException(exceptionMsg);
            } else {
                util.throwException("clickByDesc错误");
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
                util.throwException(exceptionMsg)
            } else {
                util.throwException("clickByText错误");
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
