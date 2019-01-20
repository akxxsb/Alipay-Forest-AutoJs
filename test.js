app.startActivity({
    action: "android.intent.action.VIEW",
    data: "alipays://platformapi/startapp?appId=60000002",
    packageName: "com.eg.android.AlipayGphone"
});

var close_exist = text("蚂蚁森林").exists();
var stock_tree_exist = descMatches("浩森").exists();
var mytree_exist = desc("我的大树养成记录").findOne();
if(className("android.widget.Button").desc("我的大树养成记录").exists()){
    ;
}
className("android.widget.Button").desc("我的大树养成记录").findOne()
console.show();
console.log("你好");
console.log(close_exist);
console.log(stock_tree_exist);
console.log(mytree_exist);
sleep(3000);
console.clear();
console.hide();
