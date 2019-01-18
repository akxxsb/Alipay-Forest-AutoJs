// 设置按键监听 当脚本执行时候按音量减 退出脚本
function register() {
    toastLog("注册监听事件");
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("volume_up", function(event) {
        var err_msg = "音量上被按下, 再按一次音量上";
        toastLog(err_msg);
        events.onKeyDown("volume_up", function(event) {
            err_msg = "音量上被按下, 请按一次音量下，脚本将退出 ";
            toastLog(err_msg);
            events.onKeyDown("volume_down", function(event) {
                toastLog("退出脚本");
                exit();
            });
        });
    });
}

function unregister() {
    events.removeAllKeyDownListeners("volume_up");
    events.removeAllKeyDownListeners("volume_down");
    toastLog("移除监听事件");
}

module.exports = {
    register: register,
    unregister: unregister,  
}