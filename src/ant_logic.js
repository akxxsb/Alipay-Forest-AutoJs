var utilpkg = require('./util.js');
var timepkg = require('./time.js');
var devpkg = require('./device.js');
var constantpkg = require('./constant.js');

var myEnergeType = ["test", "收集能量"];

//  等待加载收集能量页面,采用未找到指定组件阻塞的方式,等待页面加载完成
function waitPage(type) {
    // 等待进入自己的能量主页
    if (type == 0) {
        text("种树").findOne();
    }
    // 等待进入他人的能量主页
    else if (type == 1) {
        text("浇水").findOne();
    }
}

// 进入排行榜
function enterRank() {
    devpkg.wakeUp();
    toastLog("进入排行榜");
    swipe(520, 1600, 520, 400, 1000);
    swipe(520, 1600, 520, 400, 1000);
    swipe(520, 1600, 520, 400, 1000);
    timepkg.mysleep(constantpkg.SEC_1);

    utilpkg.clickByText("查看更多好友", true, "程序未找到排行榜入口,脚本退出");

    for (var i = 0; i < 5; ++i) {
        if (textEndsWith("好友排行榜").exists()) {
            return true;
        }
        timepkg.mysleep(constantpkg.SEC_1);
    }
    utilpkg.throwException("进入排行榜失败");
}


// 判断是否好有排行榜已经结束
function isRankEnd() {
    if (!textEndsWith("好友排行榜").exists()) {
        return true;
    }
    if (textEndsWith("没有更多了").exists()) {
        var b = textEndsWith("没有更多了").findOne().bounds();
        toastLog("没有更多了 pos: "+ "(" + b.centerX() + "," + b.centerY() + ")");
        if (b.centerY() < 2200) {
            toastLog("排行榜结束");
            return true;
        }
    }
    return false;
}


// 从排行榜获取可收集好友的点击位置
function getHasEnergyfriend(type) {
    var img = devpkg.getCaptureImg();
    return findImage(img, constantpkg.HAND_IMG)
}


// 在排行榜页面,循环查找可收集好友
function enterOthers() {
    toastLog("检查排行榜");

    //确保当前操作是在排行榜界面
    while (textEndsWith("好友排行榜").exists()) {
        timepkg.mysleep(constantpkg.SEC_1);
        var pos = getHasEnergyfriend(1);
        var isEnd = isRankEnd();

        if (pos == null && isEnd) {
            toastLog("排行榜结束了,程序即将退出");
            return false;
        }

        toastLog("能量 pos:" + pos);

        if (pos != null) {
            toastLog("检测到：" + pos.x + ":" + pos.y + "坐标的好友有能量可以收取噢！");
            click(pos.x / 2, pos.y + 20);
            toastLog("点击的位置为：" + pos.x / 2 + ":" + (pos.y + 20));
            waitPage(1);

            // 匹配能量球，并收取
            var energyRegex = generateCollectionType();
            if (textMatches(energyRegex).exists()) {
                textMatches(energyRegex).find().forEach(function(pos) {
                    var posb = pos.bounds();
                    click(posb.centerX(), posb.centerY() - 50);
                    toastLog("点击的位置为：" + posb.centerX() + ":" + (posb.centerY()-50));
                    timepkg.mysleep(constantpkg.SEC_1);
                });
            }

            //返回排行榜页面
            back();
            for(var i = 0; i < 5; ++i) {
                timepkg.mysleep(constantpkg.SEC_1);
                if (textEndsWith("好友排行榜").exists()) {
                    break;
                }
            }
        } else {
            // 下拉
            swipe(520, 1800, 520, 300, 1000);
        }
    }
}

// 退出蚂蚁森林界面
function goBack() {
    for (var i = 0; i < 6; ++i) {
        if(checkIsAliMainPage()){
            break;
        }
        back();
        timepkg.mysleep(constantpkg.SEC_LOW);
    }
}

// 遍历能量类型,收集自己的能量
function collectionMyEnergy() {
    waitPage(0);
    devpkg.wakeUp();
    toastLog("遍历能量，收集自己的能量");
    var energyRegex = generateCollectionType();
    toastLog(energyRegex);
    var checkInMorning = utilpkg.isMorningTime();

    if (textMatches(energyRegex).exists()) {
        if (!checkInMorning) {
            toastLog("防止小树的提示遮挡,等待中");
            timepkg.mysleep(constantpkg.SEC_2 * 2);
        }
        textMatches(energyRegex).find().forEach(function(pos) {
            var posb = pos.bounds();
            click(posb.centerX(), posb.centerY() - 50);
            toastLog("点击的位置为：" + posb.centerX() + ":" + (posb.centerY()-50));
            timepkg.mysleep(constantpkg.SEC_1);
        });
    }
    toastLog("自己能量收集完成");
}

// 从支付宝主页进入蚂蚁森林我的主页
function enterMayiForestMainPage() {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "alipays://platformapi/startapp?appId=60000002",
        packageName: "com.eg.android.AlipayGphone"
    });
    //utilpkg.clickByText("蚂蚁森林", false, "进入我的主页失败");
}

function checkIsAliMainPage() {
    return text("蚂蚁森林").exists() && text("扫一扫").exists();
}

function enterMyMainPage() {
    devpkg.wakeUp();
    enterMayiForestMainPage();
    goBack();
    for (i = 0; i < 5; ++i) {
        if (text("种树").exists()) {
            waitPage(0);
            break;
        }
        utilpkg.clickByText("蚂蚁森林", false, "进入我的主页失败");
        timepkg.mysleep(constantpkg.SEC_1);
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
    //return "收集能量";
    return regex;
}

module.exports = {
    enterMyMainPage: enterMyMainPage,
    collectionMyEnergy: collectionMyEnergy,
    enterRank: enterRank,
    enterOthers: enterOthers,
    goBack: goBack,
}
