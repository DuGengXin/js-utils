/**
 * 获取地址栏参数
 * @param {string} variable 
 * @returns 
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

/**
 * 获取本月天数
 * @param {number} year 
 * @param {number} month 
 * @returns 
 */
function getMonthDate(year, month) {
    var d = new Date(year, ++month, 0);
    return d.getDate();
}

/**
 * 获取两个时间的间隔
 * @param {Array} dateRange
 * @returns "yyyy-M-d$yyyy-M-d"
 */
function getDateRange(dateRange) {
    if (dateRange && dateRange[0] && dateRange[1])
        return dateRange[0] + "$" + dateRange[1];
    else
        return "";
}

/**
 * 日期获取  本周 本月 本季 本年
 * @param {string} val 本周 本月 本季 本年
 * @returns 
 */
function timeSlotChange(val) {
    let startTime, endTime;
    let now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getFullYear(); //当前年
    let jd = Math.ceil((nowMonth + 1) / 3);
    switch (val) {
        case "本周"://本周
            startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
            endTime = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
            break;
        case "本月"://本月
            startTime = new Date(nowYear, nowMonth, 1)
            endTime = new Date(nowYear, nowMonth + 1, 0)
            break;
        case "本季"://本季
            startTime = new Date(nowYear, (jd - 1) * 3, 1)
            endTime = new Date(nowYear, jd * 3, 0)
            break;
        case "本年"://本年
            startTime = new Date(nowYear, 0, 1)
            endTime = new Date(nowYear, 11, 31)
            break;
    }
    list = {
        sDate: startTime,
        sDateStr: dateToString(startTime),
        eDate: endTime,
        eDateStr: dateToString(endTime)
    }
    return list;
}
/**
 * 日期转字符
 * @param {date} date 
 * @returns 
 */
function dateToString(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
}

/**
 * 日期格式化
 * @param {date} date 
 * @param {string} formatter 
 * @returns 
 */
function dateFormat(date, formatter = "yyyy-MM-dd hh:mm:ss") {
    let type = Object.prototype.toString.call(date);
    if (type == "[object String]") {
        date = new Date(date);
    }
    const o = {
        "M+": date.getMonth() + 1, // 月
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 时
        "m+": date.getMinutes(), // 时
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(formatter)) {
        formatter = formatter.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(formatter))
            formatter = formatter.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    }
    return formatter;
};

/**
 * 每月日期范围
 * @param {date} date 
 * @returns 
 */
function getFirstAndLastMonthDay(date) {
    let year = date.getFullYear(),
        month = date.getMonth();
    let firstDate = year + '-' + month + '-01';
    let day = new Date(year, month, 0);
    let lastDate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期    
    return { firstDate, lastDate };
}

/**
 * 对象转url参数
 * @param {string} param 参数
 * @param {string} key 参数key
 * @param {string} encode 编码
 * @returns 
 */
function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += decodeURI(urlEncode(param[i], k, encode));
        }
    }
    return paramStr;
}

/**
 * 向父窗口发送弹窗请求
 * @data {title,formId,params,showCloseBtn,showSaveButton,width,heigth} 当前值字符串
 */
function dialogEform(data) {
    let iData = {
        operateType: "dialog",
        showCloseBtn: true,
        showSaveButton: data.showSaveButton ? true : false,
        title: data.title,
        url: `${data.formId}${data.params ? data.params : ''}`
    }
    if (data.showSaveButton) {
        iData.showSaveButton = data.showSaveButton
    }
    if (data.width) {
        iData.width = data.width
    }
    if (data.heigth) {
        iData.width = data.heigth
    }
    window.parent.postMessage(JSON.stringify(iData), '*');
}

/**
 * 发生postmessage 让父窗口打开新页面
 * @param {} data 
 */
function openNewEformWin(data) {
    let iData = {
        operateType: "openWin",
        url: data.url,
    }
    window.parent.postMessage(JSON.stringify(iData), '*');
}

/**
 * 获取js对象类型
 * @param {} obj 
 * @returns 
 */
function typeObj(obj) {
    var type = Object.prototype.toString.call(obj);
    if (type == '[object Array]') {
        return 'Array';
    } else if (type == '[object  Object]') {
        return 'Object';
    } else {
        return "obj is not object or array"
    }

}

/**
 * 获取父页面url
 * @returns 例如:http://192.168.256
 */
//获取父页面地址
function getParentUrl() {
    var url = null;
    if (parent !== window) {
        try {
            url = parent.location.href;
        } catch (e) {
            url = document.referrer;
        }
        if (url.charAt(url.length - 1) == '/')
            url = url.substring(0, url.length - 1)
    }
    return url;
}

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
const Local = {
    // 设置永久缓存
    set(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val));
    },
    // 获取永久缓存
    get(key) {
        let json = window.localStorage.getItem(key);
        return JSON.parse(json);
    },
    // 移除永久缓存
    remove(key) {
        window.localStorage.removeItem(key);
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear();
    },
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
const Session = {
    // 设置临时缓存
    set(key, val) {
        window.sessionStorage.setItem(key, JSON.stringify(val));
    },
    // 获取临时缓存
    get(key) {
        let json = window.sessionStorage.getItem(key);
        return JSON.parse(json);
    },
    // 移除临时缓存
    remove(key) {
        window.sessionStorage.removeItem(key);
    },
    // 移除全部临时缓存
    clear() {
        window.sessionStorage.clear();
    },
};