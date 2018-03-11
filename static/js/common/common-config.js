/**
* @param {void} void 无
* @return {void} void 无
**/
function namespace() {
    var a = arguments,
        o = null,
        i, j, d, rt;
    for (i = 0; i < a.length; ++i) {
        d = a[i].split(".");
        rt = d[0];
        eval('if(typeof ' + rt + '=="undefined"){' + rt + '={};}o=' + rt + ';');
        for (j = 1; j < d.length; ++j) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
}

/**
 * post
* @param {string} url 地址
* @param {Object} func 函数
* @param {Object} data 数据
* @param {bool} isAsync 是否异步
* @return {void} void 无
**/
function sync_post_ajax(url, func, data, isAsync) {
    data = (typeof(data) == "undefined") ? {} : data;
    isAsync = (typeof(isAsync) == "undefined") ? true : isAsync;
    $.ajax({
        url: url,
        async: isAsync,
        type: "POST",
        data: data,
        dataType: "json",
        timeout: 610000,
        success: function(data) {
            if (data == null) {
                alert("后台返回null!!!");
            } else if (data['status'] == 0) {
                func(data);
            } else {
                var errMsg = ""
                if (data.data != null) {
                    errMsg += JSON.stringify(data.data)
                }
                if (data.msg != null) {
                    errMsg += data.msg
                }
                alert("失败 : " + errMsg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
        }
    });
}

/**
 * get
* @param {string} url 地址
* @param {Object} func 函数
* @param {Object} data 数据
* @param {bool} isAsync 是否异步
* @return {void} void 无
**/
function sync_get_ajax(url, func, data, isAsync) {
    data = (typeof(data) == "undefined") ? {} : data;
    isAsync = (typeof(isAsync) == "undefined") ? true : isAsync;
    $.ajax({
        url: url,
        async: isAsync,
        type: "GET",
        data: data,
        dataType: "json",
        timeout: 610000,
        success: function(data) {
            if (data == null) {
                alert("后台返回null!!!");
            } else if (data['status'] == 0) {
                func(data);
            } else {
                var errMsg = ""
                if (data.data != null) {
                    errMsg += JSON.stringify(data.data)
                }
                if (data.msg != null) {
                    errMsg += data.msg
                }
                alert("失败 : " + errMsg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
        }
    });
}

/**
 * put
 * @param {string} url 地址
 * @param {Object} func 函数
 * @param {Object} data 数据
 * @param {bool} isAsync 是否异步
 * @return {void} void 无
 **/
function sync_put_ajax(url, func, data, isAsync) {
    data = (typeof(data) == "undefined") ? {} : data;
    isAsync = (typeof(isAsync) == "undefined") ? true : isAsync;
    $.ajax({
        url: url,
        async: isAsync,
        type: "PUT",
        data: data,
        dataType: "json",
        timeout: 610000,
        success: function(data) {
            if (data == null) {
                alert("后台返回null!!!");
            } else if (data['status'] == 0) {
                func(data);
            } else {
                var errMsg = ""
                if (data.data != null) {
                    errMsg += JSON.stringify(data.data)
                }
                if (data.msg != null) {
                    errMsg += data.msg
                }
                alert("失败 : " + errMsg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
        }
    });
}

/**
 * delete
 * @param {string} url 地址
 * @param {Object} func 函数
 * @param {Object} data 数据
 * @param {bool} isAsync 是否异步
 * @return {void} void 无
 **/
function sync_delete_ajax(url, func, data, isAsync) {
    data = (typeof(data) == "undefined") ? {} : data;
    isAsync = (typeof(isAsync) == "undefined") ? true : isAsync;
    $.ajax({
        url: url,
        async: isAsync,
        type: "DELETE",
        data: data,
        dataType: "json",
        timeout: 610000,
        success: function(data) {
            if (data == null) {
                alert("后台返回null!!!");
            } else if (data['status'] == 0) {
                func(data);
            } else {
                var errMsg = ""
                if (data.data != null) {
                    errMsg += JSON.stringify(data.data)
                }
                if (data.msg != null) {
                    errMsg += data.msg
                }
                alert("失败 : " + errMsg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
        }
    });
}

/**
* 判断object是否为空属性
* @param {Object} obj 对象
* @return {bool} bool 布尔
**/
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
};

/**
* 获取url中的参数
* @param {string} name url地址
* @return {string} string url地址
**/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) {
        return unescape(r[2]);
    };
    return null; // 返回参数值
}

/**
* 去除HTML标签
* @param  {string} str html字符串
* @return {string} result html字符串
**/
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
}

/**
* 去除所有空格
* @param {string} str 字符串
* @param {bool} is_global 是否全局
* @return {string} result 字符串
**/
function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

/**
* 去除所有的HTML标签和空格
* @param {string} str 字符串
* @return {string} result 字符串
**/
function safeContent(str) {
    result = Trim(str.replace(/<[^>]+>/g, ""), "g");
    return result;
}

/**
* 检测url是否正确
* @param {string} str 字符串
* @return {bool} bool 是否
**/
function checkUrl(str) {
    var RegUrl = new RegExp();
    //RegUrl.compile(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);  
    RegUrl.compile(/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
    if (!RegUrl.test(str)) {
        return false;
    }
    return true;
}

/**
* 正则式校验
* @param {string} str 字符串
* @param {string} regex 正则式
* @return {bool} bool 是否
**/
function checkRegex(str, regex) {
    var RegUrl = new RegExp();
    RegUrl.compile(regex);
    if (!RegUrl.test(str)) {
        return false;
    }
    return true;
}

/**
 * 全局判断权限
* @param {int} permissions 权限
* @return {string} value 含义
**/
function parserPermissions(permissions) {
    var value = '';
    switch (permissions) {
        case permissions <= 10:
            value = 'user';
            break;
        case permissions <= 60:
            value = 'owner';
            break;
        case permissions <= 100:
            value = 'admin';
            break;
        default:
            value = '未知权限';
            break;
    }
    return value;
}
