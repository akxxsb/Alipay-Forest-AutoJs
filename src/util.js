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
    if (hour == 6 && minu >= 40) {
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

function get_ui_object(func, text) {
    if (func(text).exists()) {
        return func(text);
    }
    return null;
}

function make_selector(func_arr) {
    var func = textStartsWith;
    var selector = function gg(text) {
        for (var i = 0; i < func_arr.length; ++i) {
            func = func_arr[i];
            var ui_object = get_ui_object(func, text);
            if (ui_object != null) {
                return ui_object;
            }
        }
        return func(text);
    }
    return selector;
}

var text_equal = make_selector([text, desc]);
var text_starts_with = make_selector([textStartsWith, descStartsWith]);
var text_ends_with = make_selector([textEndsWith, descEndsWith]);
var text_contains = make_selector([textContains, descContains]);
var text_matches = make_selector([textMatches, descMatches]);

function clickByText(text, noFindExit, err_msg) {
    //var w = selector().textEndsWith(text).find();
    var w = text_ends_with(text).find();
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
    if (hour == 22) {
        return false;
    }
    if (hour > 0 && hour < 6) {
        return false;
    }
    if (hour == 6 & minu < 50) {
        return false;
    }
    return true;
}

module.exports = {
    throwException: throwException,
    isMorningTime: isMorningTime,
    getSleepTime: getSleepTime,
    checkNeedRun: checkNeedRun,

    text_equal: text_equal,
    text_starts_with: text_starts_with,
    text_ends_with: text_ends_with,
    text_contains: text_contains,
    text_matches: text_matches,

    clickByText: clickByText,
};
