var utilpkg = require('./util.js');
var timepkg = require('./time.js');
var devpkg = require('./device.js');
var constantpkg = require('./constant.js');

var myEnergeType = ["收集能量"];

//  等待加载收集能量页面,采用未找到指定组件阻塞的方式,等待页面加载完成
function waitPage(type) {
    // 等待进入自己的能量主页
    if (type == 0) {
        text("种树").findOne(10 * constantpkg.SEC_1);
    }
    // 等待进入他人的能量主页
    else if (type == 1) {
        text("浇水").findOne(10 * constantpkg.SEC_1);
    }
}

// 进入排行榜
function enter_rank_board() {
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
function collect_friends_energy() {
    toastLog("检查排行榜");

    //确保当前操作是在排行榜界面
    while (textEndsWith("好友排行榜").exists()) {
        timepkg.mysleep(constantpkg.SEC_LOW);
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
            waitPage(1);

            // 匹配能量球，并收取
            var energyRegex = gen_collect_re();
            do_collect_energy(energyRegex);

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

// 进入支付宝首页
function enter_to_ali_main_page() {
    toastLog("打开支付宝首页");
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "alipays://platformapi/startapp?appId=60000002",
        packageName: "com.eg.android.AlipayGphone"
    });

    for (var i = 0; i < 6; ++i) {
        if(checkIsAliMainPage()){
            break;
        }
        back();
        timepkg.mysleep(constantpkg.SEC_LOW);
    }
}

function do_collect_energy(energyRegex) {
    textMatches(energyRegex).find().forEach(function(pos) {
        var posb = pos.bounds();
        click(posb.centerX(), posb.centerY() - 50);
        toastLog("点击的位置为：" + posb.centerX() + ":" + (posb.centerY()-50));
        timepkg.mysleep(constantpkg.SEC_LOW);
    });
}

// 遍历能量类型,收集自己的能量
function collect_my_energy() {
    devpkg.wakeUp();
    toastLog("遍历能量，收集自己的能量");

    var energyRegex = gen_collect_re();
    toastLog(energyRegex);

    if (textMatches(energyRegex).exists()) {
        do_collect_energy(energyRegex);
    }
    toastLog("自己能量收集完成");
}

function checkIsAliMainPage() {
    return text("蚂蚁森林").exists() && text("扫一扫").exists();
}

function enter_mayi_main_page() {
    devpkg.wakeUp();
    for (var i = 0; i < 5; ++i) {
        enter_to_ali_main_page();
        if (checkIsAliMainPage()) {
            break;
        }
        timepkg.mysleep(constantpkg.SEC_1);
    }

    for (var i = 0; i < 6; ++i) {
        if (text("种树").exists()) {
            waitPage(0);
            break;
        }
        utilpkg.clickByText("蚂蚁森林", false, "进入我的主页失败");
        timepkg.mysleep(constantpkg.SEC_1);
        if (i == 5) {
            utilpkg.throwException("打开蚂蚁森林失败, 退出本轮操作");
        }
    }
}


/**
 * 根据能量类型数组生成我的能量类型正则查找字符串
 * @returns {string}
 */
function gen_collect_re() {
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
    enter_mayi_main_page: enter_mayi_main_page,
    collect_my_energy: collect_my_energy,
    enter_rank_board: enter_rank_board,
    collect_friends_energy: collect_friends_energy,
}
