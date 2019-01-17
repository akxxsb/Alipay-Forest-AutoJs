var myEnergeType = ["test", "收集能量"];
var handimg = images.read("/storage/emulated/0/脚本/Alipay-Forest-AutoJs/handPic.bmp");

var ONE_SECOND = 1000;
var ONE_MIN = ONE_SECOND * 60;
var sec_low = 200,
    sec_1 = 200,
    sec_2 = 400;

// 早上3分钟检查一次, 平时20分钟检查一次
var MORNING_SLEEP_TIME = ONE_MIN * 3;
var NORMAL_SLEEP_TIME = ONE_SECOND * 20;

function main() {
    prepareThings();
    tLog("开始运行");
    sleep(ONE_SECOND * 3);
    unlock();
    var run_times = 1;
    for (;;) {
        tLog("第" + run_times + "次运行");
        event_loop();

        sleep_time = get_sleep_time();
        if (sleep_time > ONE_MIN) {
            var minu = sleep_time / ONE_MIN;
            tLog(minu + " 分后再次运行");
        } else {
            var sec = sleep_time / ONE_SECOND;
            tLog(sec + " 秒后再次运行");
        }
        sleep(sleep_time);
        ++run_times;
    }
}

main();
//程序主入口
function event_loop() {
    console.clear();
    console.hide();
    try {
        unlock();
        registEvent();
        // 进入蚂蚁森林主页
        enterMyMainPage();
        //收集自己的能量
        collectionMyEnergy();
        //进入排行榜
        enterRank();
        //在排行榜检测是否有好有的能量可以收集
        enterOthers();
    } catch (error) {
        console.show();
        console.clear();
        tLog(error);
    }
    go_back();
    delEvent();
}


//  等待加载收集能量页面,采用未找到指定组件阻塞的方式,等待页面加载完成
function waitPage(type) {
    // 等待进入自己的能量主页
    if (type == 0) {
        desc("种树").findOne();
    }
    // 等待进入他人的能量主页
    else if (type == 1) {
        desc("浇水").findOne();
    }
    //再次容错处理
    sleep(2000);
}

// 进入排行榜
function enterRank() {
    wakeUp();
    tLog("进入排行榜");
    swipe(520, 1600, 520, 400, 1500);
    swipe(520, 1600, 520, 400, 1500);
    swipe(520, 1600, 520, 400, 1500);
    //swipe(500, 1900, 500, 1000, 1000);
    //swipe(520, 1860, 520, 100);
    sleep(sec_1);
    clickByDesc("查看更多好友", 0, true, "程序未找到排行榜入口,脚本退出");
    var i = 0;
    //等待排行榜主页出现
    while (!textEndsWith("好友排行榜").exists() && i <= 5) {
        sleep(sec_2);
        i++;
    }
    if (i >= 5) {
        defaultException("进入排行榜失败");
    }
}


// 判断是否好有排行榜已经结束
function isRankEnd() {
    if (descEndsWith("没有更多了").exists()) {
        var b = descEndsWith("没有更多了").findOne();
        var bs = b.bounds();
        //tLog(bs.centerX()+":"+bs.centerY());
        if (bs.centerY() < 1980) {
            return true;
        }
    }
    return false;
}


// 从排行榜获取可收集好友的点击位置
function getHasEnergyfriend(type) {
    var img = getCaptureImg();

    //images.save(img, "/sdcard/2.jpg", "jpg", 100);
    var p = null;
    if (type == 1) {
        //因为找多图片点的算法不太好，改进为找小图片。
        p = findImage(img, handimg)
    }
    if (p != null) {
        return p;
    } else {
        return null;
    }
}


// 在排行榜页面,循环查找可收集好友
function enterOthers() {
    wakeUp();
    tLog("检查排行榜");
    var i = 1;
    var ePoint = getHasEnergyfriend(1);
    //确保当前操作是在排行榜界面
    while (ePoint == null && textEndsWith("好友排行榜").exists()) {
        //滑动排行榜 root方式的的点击调用.如无root权限,7.0及其以上可采用无障碍模式的相关函数
        swipe(520, 1800, 520, 300, 1000);
        sleep(sec_2);
        ePoint = getHasEnergyfriend(1);
        i++;
        var isEnd = isRankEnd();
        //检测是否排行榜结束了,修正还有能量可以收取的时候，却提前结束的问题
        if (isEnd && ePoint != null) {
            tLog("排行榜字符串已经出现，但是还有可以收集能量的好友，脚本继续运行");
        }
        if (ePoint == null && isEnd) {
            tLog("排行榜结束了,程序即将退出");
            return false;
        }
        //如果连续32次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
        else if (i > 32) {
            defaultException("程序可能出错,连续" + i + "次未检测到可收集好友");
        }
    }
    if (ePoint != null) {
        //防止某些情况，最下面的好友无法点击，所以做这个设定，保证点击的范围
        if (ePoint.y < 1800) {
            //点击位置相对找图后的修正，进入好友的森林页面
            tLog("检测到：" + ePoint.x + ":" + ePoint.y + "坐标的好友有能量可以收取噢！");
            //除以2是为了保证在最底部的好友的能量也能点的进去。
            click(ePoint.x / 2, ePoint.y + 20);
            tLog("点击的位置为：" + ePoint.x / 2 + ":" + (ePoint.y + 20));
            waitPage(1);
            //获取匹配公式
            var energyRegex = generateCollectionType();
            //匹配获取好友的能量球【数组】
            if (descMatches(energyRegex).exists()) {
                //这里存在一定的问题：如果sleep时间短的话，就会出现循环代码在运行，循环之后的代码也在运行，感觉出现了异步，具体原因不明
                descMatches(energyRegex).find().forEach(function(pos) {
                    var posb = pos.bounds();
                    //tLog( posb.centerX());
                    click(posb.centerX(), posb.centerY() - 50);
                    sleep(sec_2);
                });
            }
            //进去收集完后,递归调用enterOthers
            back();
            sleep(sec_2);
            var j = 0;
            //等待返回好有排行榜
            if (!textEndsWith("好友排行榜").exists() && j <= 5) {
                sleep(sec_2);
                j++;
            }
            if (j >= 5) {
                defaultException("enterOthers错误");
            }

        } else {
            tLog("检测到：" + ePoint.x + ":" + ePoint.y + "坐标的好友有能量可以收取,但是因为位置太底下，自动滑动位置，并且重新查找！");
            swipe(520, 500, 520, 300, 100);
            sleep(sec_2);
        }
        enterOthers();

    } else {
        defaultException("enterOthers错误");
    }
}

// 退出蚂蚁森林界面
function go_back() {
    launchApp("支付宝");
    for (var i = 0; i < 3; ++i) {
        back();
        sleep(sec_2);
    }
}

// 遍历能量类型,收集自己的能量
function collectionMyEnergy() {
    wakeUp();
    tLog("遍历能量，收集自己的能量");
    //  /(\s*线下支付$)|(\s*行走$)|(\s*共享单车$)|(\s*地铁购票$)|(\s*网络购票$)|(\s*网购火车票$)|(\s*生活缴费$)|(\s*ETC缴费$)|(\s*电子发票$)|(\s*绿色办公$)|(\s*咸鱼交易$)|(\s*预约挂号$)/
    var energyRegex = generateCollectionType();
    tLog(energyRegex);
    var checkInMorning = false;

    if (descMatches(energyRegex).exists()) {

        if (!checkInMorning) {
            tLog("防止小树的提示遮挡,等待中");
            sleep(sec_2);
        }
        //这里存在一定的问题：如果sleep时间短的话，就会出现循环代码在运行，循环之后的代码也在运行，感觉出现了异步，具体原因不明
        descMatches(energyRegex).find().forEach(function(pos) {
            var posb = pos.bounds();
            //tLog( posb.centerX());
            click(posb.centerX(), posb.centerY() - 50);
            sleep(sec_2 * 3);
        });
    }
    tLog("自己能量收集完成");
    sleep(sec_1);
}

function unlockAliPay() {
    click(195, 1170);
    click(835, 1170);
    click(500, 1170);
    click(500, 1400);
    sleep(sec_low);
}

// 从支付宝主页进入蚂蚁森林我的主页
function enterMayiForestMainPage() {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "alipays://platformapi/startapp?appId=60000002",
        packageName: "com.eg.android.AlipayGphone"
    });
    sleep(ONE_SECOND);
}

function checkIsMayiForestMainPage() {
    var ok = text("蚂蚁森林").exists();
    return ok;
}

function enterMyMainPage() {
    wakeUp();
    for (i = 0; i < 3; ++i) {
        enterMayiForestMainPage();
        if (!checkIsMayiForestMainPage()) {
            unlockAliPay();
        }
        if (i < 1) {
            go_back();
        }
        sleep(sec_2);
    }
}

/**
 * 根据描述值 点击
 * @param energyType
 * @param noFindExit
 */
function clickByDesc(energyType, paddingY, noFindExit, exceptionMsg) {
    if (descEndsWith(energyType).exists()) {
        descEndsWith(energyType).find().forEach(function(pos) {
            var posb = pos.bounds();
            click(posb.centerX(), posb.centerY() - paddingY);
            sleep(sec_2);
        });
    } else {
        if (noFindExit != null && noFindExit) {
            if (exceptionMsg != null) {
                defaultException(exceptionMsg);
            } else {
                defaultException("clickByDesc错误");
            }
        }
    }
}

/**
 * 根据text值 点击 * @param energyType * @param noFindExit
 */
function clickByText(energyType, noFindExit, exceptionMsg) {
    if (textEndsWith(energyType).exists()) {
        textEndsWith(energyType).find().forEach(function(pos) {
            var posb = pos.bounds();
            click(posb.centerX(), posb.centerY() - 60);
        });
    } else {
        if (noFindExit != null && noFindExit) {
            if (exceptionMsg != null) {
                defaultException(exceptionMsg)
            } else {
                defaultException("clickByText错误");
            }
        }
    }
}


/**
 * 根据能量类型数组生成我的能量类型正则查找字符串
 * @returns {string}
 */
function generateCollectionType() {
    var regex = "/";
    myEnergeType.forEach(function(t, num) {
        if (num == 0) {
            regex += "(\\s*" + t + "\\S*$)";
        } else {
            regex += "|(\\s*" + t + "\\S*$)";
        }
    });
    regex += "/";
    return regex;
}

// 检查是不是早上
function isMorningTime() {
    var now = new Date();
    var hour = now.getHours();
    var minu = now.getMinutes();
    if (hour == 6 && minu >= 50) {
        return true;
    }
    if (hour == 7 && minu <= 20) {
        return true;
    }
    return false;
}

function get_sleep_time() {
    if (isMorningTime()) {
        return MORNING_SLEEP_TIME;
    }
    return NORMAL_SLEEP_TIME;
}

// 唤醒屏幕
function wakeUp() {
    var i = 0;
    for (i = 0; i < 3; ++i) {
        device.wakeUp();
        sleep(sec_2);
    }
}

//解锁手机屏幕
function unlock() {
    var ts = 200,
        i = 0;
    for (i = 0; i < 3; ++i) {
        if (!device.isScreenOn()) {
            wakeUp();
            //滑动屏幕到输入密码界面
            swipe(500, 1600, 500, 700, 502);
            sleep(ts);
            tLog("开始解锁");
            //切换大小写
            click(60, 1560);
            sleep(ts);

            click(80, 1400);
            sleep(ts);
            click(438, 1560);
            sleep(ts);
            click(438, 1560);
            sleep(ts);
            click(266, 1240);
            sleep(ts);
            click(1020, 1240);
            sleep(ts);
            click(480, 1240);
            sleep(ts);
            click(266, 1240);
            sleep(ts);
            click(300, 1400);
            sleep(ts);

            //切换数字
            click(130, 1710);
            sleep(ts);

            click(141, 1245);
            sleep(ts);
            click(1002, 1245);
            sleep(ts);
            click(40, 1245);
            sleep(ts);
            click(40, 1245);
            sleep(ts);
            click(978, 1700);
            sleep(sec_2);
            back();
            sleep(ONE_SECOND);
        }
        sleep(sec_low);
    }
}


// 设置按键监听 当脚本执行时候按音量减 退出脚本
function registEvent() {
    tLog("注册监听事件");
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("volume_up", function(event) {
        var err_msg = "音量上被按下, 再按一次音量上";
        tLog(err_msg);
        events.onKeyDown("volume_up", function(event) {
            err_msg = "音量上被按下, 请按一次音量下，脚本将退出 ";
            tLog(err_msg);
            events.onKeyDown("volume_down", function(event) {
                tLog("退出脚本");
                exit();
            });
        });
    });
}

function delEvent() {
    events.removeAllKeyDownListeners("volume_up");
    events.removeAllKeyDownListeners("volume_down");
    tLog("移除监听事件");
}

// 日志输出
function tLog(msg) {
    toast(msg);
    console.log(msg);
}


//获取权限和设置参数
function prepareThings() {
    setScreenMetrics(1080, 1920);
    //请求截图
    tLog("开始截图");
    if (!requestScreenCapture()) {
        var err_msg = "请求截图权限失败";
        defaultException(err_msg);
    }
}


// 获取截图
function getCaptureImg() {
    var img0 = captureScreen();
    if (img0 == null || typeof(img0) == "undifined") {
        var err_msg = "截图失败,退出本轮操作";
        defaultException(err_msg);
    }
    return img0;
}


// 抛出异常，停止本轮操作
function defaultException(err_msg) {
    tLog(err_msg);
    throw Error(err_msg);
}