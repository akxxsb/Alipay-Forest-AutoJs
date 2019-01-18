var ref = require('./src/device.js');
ref.getCapturePerm();

app.startActivity({
    action: "android.intent.action.VIEW",
    data: "alipays://platformapi/startapp?appId=60000002",
    packageName: "com.eg.android.AlipayGphone"
});

var close_exist = text("蚂蚁森林").exists();
var stock_tree_exist = descMatches("浩森").exists();
var mytree_exist = text("能量").exists();
console.show();
console.log("你好");
console.log(close_exist);
console.log(stock_tree_exist);
console.log(mytree_exist);
sleep(3000);
console.clear();
console.hide();