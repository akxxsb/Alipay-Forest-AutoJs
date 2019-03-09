var utilpkg = require('./util.js');
var timepkg = require('./time.js');
var devpkg = require('./device.js');
var constantpkg = require('./constant.js');

var myEnergeType = ["test", "收集能量"];

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
    timepkg.mysleep(2000);
}

// 进入排行榜
function enterRank() {
    devpkg.wakeUp();
    toastLog("进入排行榜");
    swipe(520, 1600, 520, 400, 1500);
    swipe(520, 1600, 520, 400, 1500);
    swipe(520, 1600, 520, 400, 1500);
    //swipe(500, 1900, 500, 1000, 1000);
    //swipe(520, 1860, 520, 100);
    timepkg.mysleep(constantpkg.SEC_1);
    utilpkg.clickByDesc("查看更多好友", 0, true, "程序未找到排行榜入口,脚本退出");
    var i = 0;
    //等待排行榜主页出现
    while (!textEndsWith("好友排行榜").exists() && i <= 5) {
        timepkg.mysleep(constantpkg.SEC_2);
        i++;
    }
    if (i >= 5) {
        utilpkg.throwException("进入排行榜失败");
    }
}


// 判断是否好有排行榜已经结束
function isRankEnd() {
    if (descEndsWith("没有更多了").exists()) {
        var b = descEndsWith("没有更多了").findOne();
        var bs = b.bounds();
        //toastLog(bs.centerX()+":"+bs.centerY());
        if (bs.centerY() < 1980) {
            return true;
        }
    }
    return false;
}


// 从排行榜获取可收集好友的点击位置
function getHasEnergyfriend(type) {
    var img = devpkg.getCaptureImg();

    //images.save(img, "/sdcard/2.jpg", "jpg", 100);
    var p = null;
    if (type == 1) {
        //因为找多图片点的算法不太好，改进为找小图片。
        p = findImage(img, constantpkg.HAND_IMG);
    }
    if (p != null) {
        return p;
    } else {
        return null;
    }
}


// 在排行榜页面,循环查找可收集好友
function enterOthers() {
    devpkg.wakeUp();
    toastLog("检查排行榜");
    var i = 1;
    var ePoint = getHasEnergyfriend(1);
    //确保当前操作是在排行榜界面
    while (ePoint == null && textEndsWith("好友排行榜").exists()) {
        //滑动排行榜 root方式的的点击调用.如无root权限,7.0及其以上可采用无障碍模式的相关函数
        swipe(520, 1800, 520, 300, 1000);
        timepkg.mysleep(constantpkg.SEC_2);
        ePoint = getHasEnergyfriend(1);
        i++;
        var isEnd = isRankEnd();
        //检测是否排行榜结束了,修正还有能量可以收取的时候，却提前结束的问题
        if (isEnd && ePoint != null) {
            toastLog("排行榜字符串已经出现，但是还有可以收集能量的好友，脚本继续运行");
        }
        if (ePoint == null && isEnd) {
            toastLog("排行榜结束了,程序即将退出");
            return false;
        }
        //如果连续32次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
        else if (i > 32) {
            utilpkg.throwException("程序可能出错,连续" + i + "次未检测到可收集好友");
        }
    }
    if (ePoint != null) {
        //防止某些情况，最下面的好友无法点击，所以做这个设定，保证点击的范围
        if (ePoint.y < 1800) {
            //点击位置相对找图后的修正，进入好友的森林页面
            toastLog("检测到：" + ePoint.x + ":" + ePoint.y + "坐标的好友有能量可以收取噢！");
            //除以2是为了保证在最底部的好友的能量也能点的进去。
            click(ePoint.x / 2, ePoint.y + 20);
            toastLog("点击的位置为：" + ePoint.x / 2 + ":" + (ePoint.y + 20));
            waitPage(1);
            //获取匹配公式
            var energyRegex = generateCollectionType();
            //匹配获取好友的能量球【数组】
            if (descMatches(energyRegex).exists()) {
                //这里存在一定的问题：如果timepkg.mysleep时间短的话，就会出现循环代码在运行，循环之后的代码也在运行，感觉出现了异步，具体原因不明
                descMatches(energyRegex).find().forEach(function(pos) {
                    var posb = pos.bounds();
                    //toastLog( posb.centerX());
                    click(posb.centerX(), posb.centerY() - 50);
                    timepkg.mysleep(constantpkg.SEC_2);
                });
            }
            //进去收集完后,递归调用enterOthers
            back();
            timepkg.mysleep(constantpkg.SEC_2);
            var j = 0;
            //等待返回好有排行榜
            if (!textEndsWith("好友排行榜").exists() && j <= 5) {
                timepkg.mysleep(constantpkg.SEC_2);
                j++;
            }
            if (j >= 5) {
                utilpkg.throwException("enterOthers错误");
            }

        } else {
            toastLog("检测到：" + ePoint.x + ":" + ePoint.y + "坐标的好友有能量可以收取,但是因为位置太底下，自动滑动位置，并且重新查找！");
            swipe(520, 500, 520, 300, 100);
            timepkg.mysleep(constantpkg.SEC_2);
        }
        enterOthers();

    } else {
        utilpkg.throwException("enterOthers错误");
    }
}

// 退出蚂蚁森林界面
function goBack() {
    for (var i = 0; i < 3; ++i) {
        back();
        timepkg.mysleep(constantpkg.SEC_2);
    }
}

// 遍历能量类型,收集自己的能量
function collectionMyEnergy() {
    devpkg.wakeUp();
    toastLog("遍历能量，收集自己的能量");
    //  /(\s*线下支付$)|(\s*行走$)|(\s*共享单车$)|(\s*地铁购票$)|(\s*网络购票$)|(\s*网购火车票$)|(\s*生活缴费$)|(\s*ETC缴费$)|(\s*电子发票$)|(\s*绿色办公$)|(\s*咸鱼交易$)|(\s*预约挂号$)/
    var energyRegex = generateCollectionType();
    toastLog(energyRegex);
    var checkInMorning = utilpkg.isMorningTime();

    if (descMatches(energyRegex).exists()) {

        if (!checkInMorning) {
            toastLog("防止小树的提示遮挡,等待中");
            timepkg.mysleep(constantpkg.SEC_2);
        }
        //这里存在一定的问题：如果timepkg.mysleep时间短的话，就会出现循环代码在运行，循环之后的代码也在运行，感觉出现了异步，具体原因不明
        descMatches(energyRegex).find().forEach(function(pos) {
            var posb = pos.bounds();
            //toastLog( posb.centerX());
            click(posb.centerX(), posb.centerY() - 50);
            timepkg.mysleep(constantpkg.SEC_2 * 3);
        });
    }
    toastLog("自己能量收集完成");
    timepkg.mysleep(constantpkg.SEC_2);
}

// 从支付宝主页进入蚂蚁森林我的主页
function enterMayiForestMainPage() {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "alipays://platformapi/startapp?appId=60000002",
        packageName: "com.eg.android.AlipayGphone"
    });
    timepkg.mysleep(constantpkg.ONE_SECOND * 2);
}

function checkIsMayiForestMainPage() {
    var ok = text("蚂蚁森林").exists();
    return ok;
}

function enterMyMainPage() {
    devpkg.wakeUp();
    for (i = 0; i < 2; ++i) {
        enterMayiForestMainPage();
        if (!checkIsMayiForestMainPage()) {
            devpkg.unlockAliPay();
            enterMayiForestMainPage();
        }
        if (i < 1) {
            goBack();
        }
        timepkg.mysleep(constantpkg.SEC_2);
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
    toastLog("reg: "+regex);
    return regex;
}

module.exports = {
    enterMyMainPage: enterMyMainPage,
    collectionMyEnergy: collectionMyEnergy,
    enterRank: enterRank,
    enterOthers: enterOthers,
    goBack: goBack,
}
