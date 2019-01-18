var constantpkg = require('./constant.js');

function mysleep(ms) {
    if (ms < constantpkg.ONE_SECOND * 3) {
        sleep(ms);
        return;
    }

    var rand_l, rand_r;
    if (ms > constantpkg.ONE_MIN) {
        rand_l = 10 * constantpkg.ONE_SECOND;
        rand_r = 100 * constantpkg.ONE_SECOND;
    } else {
        rand_l = 1 * constantpkg.ONE_SECOND;
        rand_r = 10 * constantpkg.ONE_SECOND;
    }
    var begin = (new Date()).getTime();
    var end = begin + ms + random(rand_l, rand_r);

    var per = constantpkg.ONE_SECOND * 5;
    var max_count = parseInt(ms / per) + 20;

    var all_sec = parseInt((end - begin) / constantpkg.ONE_SECOND);
    // 每3分钟打次log
    var print_interval = 36;
    for (var i = 0; i < max_count; ++i) {
        // 休眠5s;
        sleep(per);
        var cur = (new Date()).getTime();
        var left = end - cur;
        if (left <= 0) {
            break;
        }
        if (i % print_interval == 0) {
            left_sec = parseInt(left / constantpkg.ONE_SECOND);
            var msg = "total: " + all_sec +  ", left: " + left_sec;
            toastLog(msg);
        }
    }
}

module.exports = {
    mysleep: mysleep,
}
