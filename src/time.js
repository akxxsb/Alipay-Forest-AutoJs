var constantpkg = require('./constant.js');

function mysleep(ms) {
    if (ms < constantpkg.ONE_SECOND * 3) {
        sleep(ms);
        return;
    }

    var begin = (new Date()).getTime();
    var end = begin + ms;

    var per = constantpkg.ONE_SECOND * 1;
    var max_count = parseInt(ms / per) + 20;

    var all_sec = parseInt((end - begin) / constantpkg.ONE_SECOND);
    // 每300s打次log
    var print_interval = constantpkg.ONE_SECOND * 300 / per;
    for (var i = 0; i < max_count; ++i) {
        // 休眠;
        sleep(per);

        var cur = (new Date()).getTime();
        var left = end - cur;
        if (left <= 0) {
            break;
        }

        if (i % print_interval == 0) {
            var left_sec = parseInt(left / constantpkg.ONE_SECOND);
            var use_sec = parseInt((cur - begin) / constantpkg.ONE_SECOND);
            var msg = "total: " + all_sec + ", used: " + use_sec + ", left: " + left_sec + ", i:" + i;
            toastLog(msg);
        }
    }
}

module.exports = {
    mysleep: mysleep,
}
