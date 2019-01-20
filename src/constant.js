var ONE_SECOND = 1000;
var ONE_MIN = ONE_SECOND * 60;
var SEC_LOW = 200,
    SEC_1 = 250,
    SEC_2 = 500;

// 早上3分钟检查一次, 平时20分钟检查一次
var MORNING_SLEEP_TIME = ONE_MIN * 3;
var NORMAL_SLEEP_TIME = ONE_MIN * 25;
var HAND_IMG = images.read("./resource/handPic.bmp");

module.exports = {
    ONE_SECOND: ONE_SECOND,
    ONE_MIN: ONE_MIN,
    SEC_LOW: SEC_LOW,
    SEC_1: SEC_1,
    SEC_2: SEC_2,
    MORNING_SLEEP_TIME: MORNING_SLEEP_TIME,
    NORMAL_SLEEP_TIME: NORMAL_SLEEP_TIME,
    HAND_IMG: HAND_IMG,
}
