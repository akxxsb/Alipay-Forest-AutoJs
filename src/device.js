var utilpkg = require('./util.js');
var constantpkg = require('./constant.js');
var timepkg = require('./time.js');

//获取权限
function getCapturePerm() {
    auto.waitFor();
    setScreenMetrics(1080, 2248);
    //请求截图
    toastLog("开始截图");
    if (!requestScreenCapture()) {
        var err_msg = "请求截图权限失败";
        utilpkg.throwException(err_msg);
    }
}

// 获取截图
function getCaptureImg() {
    var img0 = captureScreen();
    if (img0 == null || typeof(img0) == "undifined") {
        var err_msg = "截图失败,退出本轮操作";
        utilpkg.throwException(err_msg);
    }
    return img0;
}

function do_unlock(passwd) {
    var row = [1300, 1500, 1700, 1900];
    var col = [240, 540, 840];

    // [0-9]
    var digit_pos = [[row[3], col[1]]];
    for (var row_i = 0; row_i < 3; ++row_i) {
        for (var col_i = 0; col_i < 3; ++col_i) {
            digit_pos.push([row[row_i], col[col_i]])
        }
    }

    for (var i = 0; i < passwd.length; ++i) {
        var pos = digit_pos[parseInt(passwd[i])];
        press(pos[1], pos[0], 150);
        sleep(150);
    }
}

//解锁手机屏幕
function unlock() {
    for (i = 0; i < 3; ++i) {
        if (!device.isScreenOn()) {
            wakeUp();
            //滑动屏幕到输入密码界面
            swipe(500, 1600, 500, 700, 502);
            timepkg.mysleep(constantpkg.SEC_LOW);

            do_unlock(constantpkg.PASSWD)
            back();
        }
        timepkg.mysleep(constantpkg.SEC_LOW);
    }
}


// 唤醒屏幕
function wakeUp() {
    var i = 0;
    for (i = 0; i < 3; ++i) {
        device.wakeUpIfNeeded();
        timepkg.mysleep(constantpkg.SEC_LOW);
    }
}

function unlockAliPay() {
    timepkg.mysleep(constantpkg.SEC_LOW);
}

module.exports = {
    getCapturePerm: getCapturePerm,
    getCaptureImg: getCaptureImg,
    unlock: unlock,
    unlockAliPay: unlockAliPay,
    wakeUp: wakeUp,
};
