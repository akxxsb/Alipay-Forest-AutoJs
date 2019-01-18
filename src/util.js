// 抛出异常，停止本轮操作
function throwException(err_msg) {
    toastLog(err_msg);
    throw Error(err_msg);
}

module.exports = {
	throwException: throwException
};