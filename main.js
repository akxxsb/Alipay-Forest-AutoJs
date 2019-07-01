var utilpkg = require('./src/util.js');
var devpkg = require('./src/device.js');
var constantpkg = require('./src/constant.js');
var timepkg = require('./src/time.js');
var antpkg = require('./src/ant_logic.js');

function main() {
    devpkg.getCapturePerm();
    toastLog("开始运行");
    timepkg.mysleep(constantpkg.ONE_SECOND * 3);

    var run_times = 1;
    for (;;) {
        toastLog("第" + run_times + "次运行");
        event_loop(run_times);

        sleep_time = utilpkg.getSleepTime();
        if (sleep_time > constantpkg.ONE_MIN) {
            var minu = parseInt(sleep_time / constantpkg.ONE_MIN);
            toastLog(minu + " 分后再次运行");
        } else {
            var sec = parseInt(sleep_time / constantpkg.ONE_SECOND);
            toastLog(sec + " 秒后再次运行");
        }
        timepkg.mysleep(sleep_time);
        ++run_times;
    }
}

main();
//程序主入口
function event_loop(loop) {
    if (loop > 1 && !utilpkg.checkNeedRun()) {
        return false;
    }

    console.clear();
    console.hide();

    try {
        devpkg.unlock();
        // 进入蚂蚁森林主页
        antpkg.enterMyMainPage();
        //收集自己的能量
        antpkg.collectionMyEnergy();
        //进入排行榜
        antpkg.enterRank();
        //在排行榜检测是否有好有的能量可以收集
        antpkg.enterOthers();
    } catch (error) {
        console.show();
        console.clear();
        toastLog(error);
    }
    return true;
}
