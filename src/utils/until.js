const langCd = "2052";
const type = "3050.130";
const myLanguage = "1033";
const myLang = "en";

class until {
  remainLeftObjProp(leftObj, rightObj) {
    for (const key in leftObj) {
      if (rightObj.hasOwnProperty(key)) {
        const element = rightObj[key];
        leftObj[key] = element;
      }
    }
    return leftObj;
  }
  trimStr(str) {
    return str.trim();
  }
  requireVerify(obj, array) {
    let msg = "";
    array.map(item => {
      if (msg) {
        return;
      } else {
        for (let [key, val] of Object.entries(item)) {
          if (obj[key]==='' || obj[key] === "undefined" || obj[key] === undefined || obj[key] === null) {
            console.log('++++++++++++++++++++++++')
            console.log(item)
            console.log(obj[key])
            msg = `${val}必填`;
          }
        }
      }
    });

    return msg;
  }
  showToast(title, icon, duration) {
    wx.showToast({ title, icon, duration });
  }
  //,分割数组
  cutArray(str) {
    let result = [];
    if (str.indexOf(",") > -1) {
      result = str.split(",");
    } else {
      result.push(str);
    }
    return result;
  }
  //跳转页面
  aHref(url) {
    console.log("url");
    wx.navigateTo({
      url
    });
    // window.location.href = url;
  }
  //跳转页面
  aHrefRedirectTo(url) {
    wx.redirectTo({
      url
    });
    // window.location.href = url;
  }
  //后退
  back(num) {
    if (num) {
      wx.navigateBack({
        delta: num
      });
    } else {
      wx.navigateBack();
    }
  }
  //session存取
  seSave(name, obj) {
    wx.setStorage({
      key: name,
      data: obj
    });
  }
  seGet(name) {
    return wx.getStorageSync(name);
  }
  seRemove(name) {
    wx.removeStorageSync(name);
  }
  seClear(){
    wx.clearStorageSync()
  }
  //local存取
  loSave(name, obj) {
    localStorage.setItem(name, obj);
  }
  loGet(name) {
    return localStorage.getItem(name);
  }
  loRemove(name) {
    localStorage.removeItem(name);
  }
  //获取TS_token
  getToken() {
    return JSON.parse(sessionStorage.getItem("YJ_token"));
  }
  getIpPk(obj) {
    let ipPk = obj.ipPk;
    return ipPk;
  }
  //截取URL参数
  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return null;
    }
  }
  //判断是否空对象
  isEmptyObject(obj) {
    for (var name in obj) {
      return false; //返回false，不为空对象
    }
    return true; //返回true，为空对象
  }
  //格式化日期,返回 年 月 日 星期
  formatDate(str = "") {
    str = str == "" ? new Date() : new Date(str);
    let week = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let year = str.getFullYear();
    let month = str.getMonth() + 1 < 10 ? "0" + (str.getMonth() + 1) : str.getMonth() + 1;
    let day = str.getDate() < 10 ? "0" + str.getDate() : str.getDate();
    let hour = str.getHours() < 10 ? "0" + str.getHours() : str.getHours();
    let minite = str.getMinutes() < 10 ? "0" + str.getMinutes() : str.getMinutes();
    let second = str.getSeconds() < 10 ? "0" + str.getSeconds() : str.getSeconds();
    week = week[str.getDay()];
    return { year, month, day, week, hour, minite, second };
  }
  //指定时间倒计时(结束秒数)
  TimeSlot(count) {
    let end = new Date();
    //Date类型的valueOf(),返回当前日期毫秒数,可以直接比较
    if (count < end) {
      return { h: "00", m: "00", s: "00" };
    }
    let total = (count - end.getTime()) / 1000;
    let h = parseInt((total / (60 * 60)) % 24);
    let m = parseInt((total / 60) % 60);
    let s = parseInt(total % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    return { h, m, s };
  }
  TimeStep(times, endTime) {
    let start = new Date(times);
    let end = endTime ? new Date(endTime) : new Date();
    let count = (end.getTime() - start.getTime()) / 1000;
    let d = parseInt(count / (60 * 60) / 24);
    return d;
  }
  //设置只能输入数字
  formatNumber(val) {
    let reg = /^\d+$/g;
    val = val.toString();
    if (val.match(reg)) {
      return val * 1;
    } else {
      if (val == "") {
        return "";
      }
      if (!val[0].match(reg)) {
        return "";
      }
      let str = "",
        len = val.length;
      for (let i = 0; i < len; i++) {
        str += val[i].match(reg) ? val[i] : "";
      }
      return parseInt(str);
    }
  }
  count(flag, val, max) {
    //加减按钮点击
    max = parseInt(max);
    if (max == 0) {
      return 0;
    }
    if (flag == "-") {
      return val == 1 ? 1 : --val;
    } else {
      return val == max ? max : ++val;
    }
  }
  //数组排序(某属性数值)
  Sort(array, flag, state = "up") {
    let box = array.sort((v1, v2) => {
      if (state == "up") {
        return v1[flag] - v2[flag];
      } else {
        return v2[flag] - v1[flag];
      }
    });
    return box;
  }
  //随机生成 n~m 之间的数
  Random(min, max) {
    let choices = max - min + 1;
    return Math.floor(Math.random() * choices + min);
  }
}
class reg {
  //验证是否有空值
  checkEmpty(obj) {
    for (let [key, val] of Object.entries(obj)) {
      if (val === "") {
        return "请补全信息！";
      }
    }
    return "ok";
  }
  //6-8位数字
  checkPwd(str) {
    let regPhone = /^\d{6,8}$/;
    if (str == "") {
      return "请输入密码";
    }
    if (str.match(regPhone) == null) {
      return "请设置6-8位数字密码";
    }
    return "ok";
  }
  //验证身份证号码
  checkCard(str) {
    //15位数身份证正则表达式
    let arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //18位数身份证正则表达式
    let arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    if (str == "") {
      return "请输入身份证号码";
    }
    if (str.match(arg1) == null && str.match(arg2) == null) {
      return "请输入正确的身份证号码";
    }
    return "ok";
  }
  //验证手机号
  checkPhone(str) {
    let regPhone = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|17[0-9]{1}|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!str) {
      return "请输入手机号";
    }

    if (!regPhone.test(str)) {
      return "请填写正确的手机号";
    }
    return "ok";
  }
  //验证电话号和手机号
  checkTel(str) {
    let regPhone = /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]\d{9})/;
    if (str == "") {
      return "请输入电话号";
    }

    if (!regPhone.test(str)) {
      return "请填写正确的电话号";
    }
    return "ok";
  }
  //验证用户名
  checkUserName(str) {
    let reg = /[\u4e00-\u9fa5]/g;
    if (str.length == 0) {
      return "请输入用户名";
    }
    if (reg.test(str)) {
      return "用户名不能包含中文";
    }
    return "ok";
  }
  //验证真实姓名
  checkName(str) {
    let reg = /^[\u4E00-\u9FA5]+$/;
    if (str.length == 0) {
      return "请输入真实姓名";
    }
    if (str.length < 2) {
      return "请输入正确名字";
    }
    if (!reg.test(str)) {
      return "请输入中文名";
    }
    return "ok";
  }

  //验证邮箱
  checkMail(str) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (str == "") {
      return "请输入邮箱";
    }
    if (!reg.test(str)) {
      return "请输入正确的邮箱";
    }
    return "ok";
  }

  //验证银行卡号
  checkMoney(str) {
    let reg = /^([1-9]{1})(\d{14}|\d{18})$/;
    if (str == "") {
      return "请输入银行卡号";
    }
    if (!reg.test(str)) {
      return "请输入正确的银行卡号";
    }
    return "ok";
  }
}
class App {
  //调用本地java方法
  NativeInterface(name, data) {
    let $q = new Promise((resolve, reject) => {
      window.WebViewJavascriptBridge.callHandler(name, data, (res = undefined) => {
        res = res ? res : JSON.parse(res);
        resolve(res);
      });
    });
    return $q;
  }
  //判断JS环境
  IsAndroid() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    return isAndroid;
  }
  IsIos() {
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
  }
  IsWx() {
    let u = navigator.userAgent.toLowerCase();
    let isWx = u.match(/MicroMessenger/i) == "micromessenger";
    return isWx;
  }
}

export { until, reg, langCd, type, hostUrl, myLanguage, myLang };
