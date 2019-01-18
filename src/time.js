var constant = require('./constant.js');

function mysleep(ms) {
    if (ms < constant.ONE_SECOND * 3) {
        sleep(ms);
        return;
    }

    var rand_l, rand_r;
    if (ms > constant.ONE_MIN) {
        rand_l = 10 * constant.ONE_SECOND;
        rand_r = 100 * constant.ONE_SECOND;
    } else {
        rand_l = 1 * constant.ONE_SECOND;
        rand_r = 10 * constant.ONE_SECOND;
    }
    var begin = (new Date()).getTime();
    var end = begin + random(rand_l, rand_r);

    var per = constant.ONE_SECOND * 5;
    var max_count = parseInt(ms / per) + 20;

    var all_sec = parseInt((end - begin) / constant.ONE_SECOND);
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
            left_sec = parseInt(left / constant.ONE_SECOND);
            var msg = "total: " + all_sec +  ", left: " + left_sec;
        }
    }
}

module.exports = {
    mysleep: mysleep,
}
