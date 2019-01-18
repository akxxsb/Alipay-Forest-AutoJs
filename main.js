var util = require('./src/util.js');
var dev = require('./src/device.js');
var constant = require('./src/constant.js');
var time = require('./scr/time.js');
var ant = require('./src/ant_logic.js');


function main() {
    dev.getCapturePerm();
    toastLog("开始运行");
    time.mysleep(constant.ONE_SECOND * 3);

    var run_times = 1;
    for (;;) {
        toastLog("第" + run_times + "次运行");
        event_loop();

        sleep_time = util.getSleepTime();
        if (sleep_time > constant.ONE_MIN) {
            var minu = sleep_time / constant.ONE_MIN;
            toastLog(minu + " 分后再次运行");
        } else {
            var sec = sleep_time / constant.ONE_SECOND;
            toastLog(sec + " 秒后再次运行");
        }
        time.mysleep(sleep_time);
        ++run_times;
    }
}

main();
//程序主入口
function event_loop() {
    if (!util.checkNeedRun()) {
        return false;
    }

    console.clear();
    console.hide();

    try {
        dev.unlock();
        // 进入蚂蚁森林主页
        ant.enterMyMainPage();
        //收集自己的能量
        ant.collectionMyEnergy();
        //进入排行榜
        ant.enterRank();
        //在排行榜检测是否有好有的能量可以收集
        ant.enterOthers();
    } catch (error) {
        console.show();
        console.clear();
        toastLog(error);
    }
    ant.goBack();
    return true;
}
