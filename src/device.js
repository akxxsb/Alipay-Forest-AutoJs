//获取权限和设置参数prepareThings
var util = require('./util.js');

function getCapturePerm() {
    setScreenMetrics(1080, 1920);
    //请求截图
    toastLog("开始截图");
    if (!requestScreenCapture()) {
        var err_msg = "请求截图权限失败";
        util.throwException(err_msg);
    }
}

module.exports = {
	getCapturePerm: getCapturePerm,
};
