var ONE_SECOND = 1000;
var ONE_MIN = ONE_SECOND * 60;
var SEC_LOW = 500,
    SEC_1 = 800,
    SEC_2 = 1500;

var PASSWD = "1619";

// 早上3分钟检查一次, 平时20分钟检查一次
var MORNING_SLEEP_TIME = ONE_MIN * 1.5;
var NORMAL_SLEEP_TIME = ONE_MIN * 22;
var HAND_IMG = images.read("./resource/ok.jpg");

module.exports = {
    ONE_SECOND: ONE_SECOND,
    ONE_MIN: ONE_MIN,
    SEC_LOW: SEC_LOW,
    SEC_1: SEC_1,
    SEC_2: SEC_2,
    MORNING_SLEEP_TIME: MORNING_SLEEP_TIME,
    NORMAL_SLEEP_TIME: NORMAL_SLEEP_TIME,
    PASSWD: PASSWD,
    HAND_IMG: HAND_IMG,
}
