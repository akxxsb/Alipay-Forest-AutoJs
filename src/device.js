//获取权限和设置参数prepareThings
var util = require('./util.js');
var constant = require('./constant.js');
var time = require('./time.js');

function getCapturePerm() {
    setScreenMetrics(1080, 1920);
    //请求截图
    toastLog("开始截图");
    if (!requestScreenCapture()) {
        var err_msg = "请求截图权限失败";
        util.throwException(err_msg);
    }
}

// 获取截图
function getCaptureImg() {
    var img0 = captureScreen();
    if (img0 == null || typeof(img0) == "undifined") {
        var err_msg = "截图失败,退出本轮操作";
        util.throwException(err_msg);
    }
    return img0;
}

//解锁手机屏幕
function unlock() {
    var ts = 100,
        i = 0;
    for (i = 0; i < 3; ++i) {
        if (!device.isScreenOn()) {
            wakeUp();
            //滑动屏幕到输入密码界面
            swipe(500, 1600, 500, 700, 502);
            time.mysleep(ts);
            toastLog("开始解锁");
            //切换大小写
            click(60, 1560);
            time.mysleep(ts * 2);

            click(80, 1400);
            time.mysleep(ts);
            click(438, 1560);
            time.mysleep(ts);
            click(438, 1560);
            time.mysleep(ts);
            click(266, 1240);
            time.mysleep(ts);
            click(1020, 1240);
            time.mysleep(ts);
            click(480, 1240);
            time.mysleep(ts);
            click(266, 1240);
            time.mysleep(ts);
            click(300, 1400);
            time.mysleep(ts);

            //切换数字
            click(130, 1710);
            time.mysleep(ts * 2);

            click(141, 1245);
            time.mysleep(ts);
            click(1002, 1245);
            time.mysleep(ts);
            click(40, 1245);
            time.mysleep(ts);
            click(40, 1245);
            time.mysleep(ts);
            click(978, 1700);
            time.mysleep(constant.SEC_2);
            back();
            time.mysleep(constant.ONE_SECOND);
        }
        time.mysleep(constant.SEC_LOW);
    }
}


// 唤醒屏幕
function wakeUp() {
    var i = 0;
    for (i = 0; i < 3; ++i) {
        device.wakeUpIfNeeded();
        time.mysleep(constant.SEC_2);
    }
}

function unlockAliPay() {
    click(195, 1170);
    click(835, 1170);
    click(500, 1170);
    click(500, 1400);
    time.mysleep(constant.SEC_LOW);
}

module.exports = {
	getCapturePerm: getCapturePerm,
	getCaptureImg: getCaptureImg,
	unlock: unlock,
	wakeUp: wakeUp,
};
