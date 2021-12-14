const config = require("./config");

function get(url, data, header) {
 /*  wx.showLoading({
    title: "加载中"
  }); */
  let myData = {};
  if (data) {
    //过滤掉空的参数
    for (let [key, val] of Object.entries(data)) {
      if (val!=='') {
        myData[key] = val;
      }
    }
  }

  let promise = new Promise((resolve, reject) => {
    wx.request({
      data: myData,
      method: "get",
      header: header
        ? header
        : {
            "Content-Type": "application/json"
          },
      url: config.serverURL + url,
      success: function(res) {
        wx.hideLoading();
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
            duration: 2000
          });
          // reject(res.data)
        }
      },
      fail: function(err) {
        wx.showToast({
          icon: "none",
          title: JSON.stringify(err),
          duration: 2000
        });
        reject(err);
      },
      complete: function() {}
    });
  });
  return promise;
}

function getTotal(url, data, header) {
 /*  wx.showLoading({
    title: "加载中"
  }); */
  let myData = {};
  if (data) {
    //过滤掉空的参数
    for (let [key, val] of Object.entries(data)) {
      if (val) {
        myData[key] = val;
      }
    }
  }

  let promise = new Promise((resolve, reject) => {
    wx.request({
      data: myData,
      method: "get",
      header: header
        ? header
        : {
            "Content-Type": "application/json"
          },
      url: config.serverURL + url,
      success: function(res) {
        wx.hideLoading();
        resolve(res.data);
      },
      fail: function(err) {
        wx.showToast({
          icon: "none",
          title: JSON.stringify(err),
          duration: 2000
        });
        reject(err);
      },
      complete: function() {}
    });
  });
  return promise;
}

function post(url, data, header) {
 /*  wx.showLoading({
    title: "加载中"
  }); */
  let promise = new Promise((resolve, reject) => {
    wx.request({
      data: data,
      header,
      method: "post",
      url: config.serverURL + url,
      success: function(res) {
        wx.hideLoading();
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg || res.data.message,
            duration: 8000
          });
          // reject(res.data.msg)
        }
      },
      fail: function(err) {
        wx.showToast({
          icon: "none",
          title: JSON.stringify(err),
          duration: 8000
        });
        // reject(err)
      },
      complete: function() {}
    });
  });
  return promise;
}

class api {
  login(data) {
    return new Promise((resolve, reject) => {
      getTotal("/wxMa/access/login", data).then(res => {
        resolve(res);
      });
    });
  }
  bindUser(data) {
    return new Promise((resolve, reject) => {
      get("/wxMa/access/bind", data).then(res => {
        resolve(res.data);
      });
    });
  }
  sysLoginOut() {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };
    get("/wxMa/access/loginOut", "", header).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: "退出成功",
          icon: "success"
        });
        setTimeout(() => {
          wx.reLaunch({
            url: "../../login/index/main"
          });
        }, 1000);
      }
    });
  }
  temporaryGetToken(data) {
    return new Promise((resolve, reject) => {
      get("/general/access/login", data).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }
  getSysProReportList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/report/api/page", data, header).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }
  //公海
  getSysOpenSeaReportList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      get("/crm/report/api/pageByShare", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  getSysReportInfo(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      post(`/crm/report/api/${data}/info`, "", header).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }
  getSysFollowRecordList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/reportVisit/api/page", data, header).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }
  sysFollowRecordSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      post("/crm/reportVisit/api/save", data, header).then(res => {
        if (res.code === 0) {
          //提示
          wx.showToast({
            title: "保存成功",
            icon: "success"
          });
          resolve(res.code);
        }
      });
    });
  }
  getSysRecodeInfo(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/reportVisit/api/info/${data}`, "", header).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        }
      });
    });
  }
  //获取首页轮播图
  banner(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };
    let promise = new Promise((resolve, reject) => {
      get(data, "", header).then(res => {
        resolve(res.data.list);
      });
    });
    return promise;
  }
  //联系人分页
  getSysCustomer(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/customer/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //联系人列表
  getSysCustomerList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/customer/api/list", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //地区
  getAddr(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    let promise = new Promise((resolve, reject) => {
      get("/crm/region/api/list", data, header).then(res => {
        resolve(res.data);
      });
    });
    return promise;
  }
  //地区
  getAddr2() {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    let promise = new Promise((resolve, reject) => {
      get("/crm/region/listItmTableTreeNode?pid=0", '', header).then(res => {
        resolve(res.data.list);
      });
    });
    return promise;
  }
  customerSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    post("/crm/customer/api/save", data, header).then(res => {
      wx.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    });
  }
  sysReportInfoSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      post("/crm/report/api/save", data, header).then(res => {
        wx.showToast({
          title: "操作成功",
          icon: "success",
          duration: 500
        });

        setTimeout(() => {
          resolve(res);
        }, 1000);
      });
    });
  }
  // 更新报备信息
  sysReportInfoEdit(data){
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      post("/crm/report/api/upd", data, header).then(res => {
        wx.showToast({
          title: "操作成功",
          icon: "success",
          duration: 500
        });

        // setTimeout(() => {
          resolve(res);
        // }, 1000);
      });
    });
  }
  //得到用户信息
  getSysUserInfo() {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };
    return new Promise((resolve, reject) => {
      get("/wxMa/access/getUserInfoByToken", "", header).then(res => {
        resolve(res.data.userInfo);
      });
    });
  }
  //数据字典
  getBaseDictionaryList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };
    return new Promise((resolve, reject) => {
      get("/crm/syscat/api/listByPcd", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //相关报备列表
  getSysRelatedReportList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return new Promise((resolve, reject) => {
      get("/crm/report/api/list", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //报备审核
  getSysReportApproveBack(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return new Promise((resolve, reject) => {
      post("/crm/report/api/check", data, header).then(res => {
        resolve(res);
      });
    });
  }
  //订单列表
  orderList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return get("/crm/order/api/page", data, header);
  }
  //订单详情
  orderDetail(id) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return new Promise((resolve, reject) => {
      post("/crm/order/api/" + id + "/info", "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //付款情况
  payStatusList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return get("/crm/pay/api/page", data, header);
  }
  //物流信息
  logistics(id) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return new Promise((resolve, reject) => {
      get(
        "/crm/kuaidi100/getOrderKuaidi",
        {
          num: id
        },
        header
      ).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发分页列表
  getSysMarketDevListByPage(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };
    return new Promise((resolve, reject) => {
      get("/crm/marketDev/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  sysMarketDevSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    post("/crm/marketDev/api/save", data, header).then(res => {
      wx.showToast({
        title: "新建成功",
        icon: "success",
        duration: 400
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    });
  }
  //市场开发详情
  getSysMarketDevInfoById(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/marketDev/api/${data}/info`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发批阅记录列表
  getSysMarketDevApprByPage(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/marketMark/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发跟进新增
  sysMarketDevVisitSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      post("/crm/marketVisit/api/save", data, header).then(res => {
        resolve(res);
      });
    });
  }
  //市场开发跟进分页
  getSysMarketDevVisitByPage(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/marketVisit/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发跟进详情
  getSysMarketDevVisitInfoById(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/marketVisit/api/${data}/info`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发领导批阅
  sysMarketDevCheckSave(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    return new Promise((resolve, reject) => {
      post("/crm/marketDev/api/check", data, header).then(res => {
        resolve(res);
      });
    });
  }
  //销售资料分类列表
  getSysSaleDataCatList(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/saleDataCat/api/list", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //销售资料分页列表
  getSysSaleDataListByPage(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/saleData/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //销售资料详情
  getSysSaleDataInfoById(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/saleData/api/info/${data}`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //我的消息分页
  getSysMsgListByPage(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get("/crm/msg/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //我的消息详情
  getSysMsgInfo(data, userId) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/msg/api/${data}/${userId}/info`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //联系人详情
  getSysLinkedInfoById(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token")
    };

    return new Promise((resolve, reject) => {
      get(`/crm/customer/api/info/${data}`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //修改密码
  sysResetPassword(data) {
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
      "Content-Type": "application/x-www-form-urlencoded"
    };

    post("/crm/user/api/resetPassword", data, header).then(res => {
      wx.showToast({
        title: "修改成功",
        icon: "success",
        duration: 400
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    });
  }
  //头像保存
  sysUserInfoAvatarUrlSave(data) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };

    post("/sys/user/updSelf", data, header).then(res => {
      wx.showToast({
        title: "上传头像成功",
        icon: "success",
        duration: 400
      });
    });
  }
  //删除联系人
  sysDelLinked(data) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };

    get(`/crm/customer/api/del/${data}`, "", header).then(res => {
      wx.showToast({ title: "删除成功", icon: "success", duration: 400 });
      setTimeout(() => {
        wx.navigateBack({ delta: 2 });
      }, 1000);
    });
  }
  //具体某条项目报备的跟进记录
  getSysReportFollowRecordLog(data) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };

    return new Promise((resolve, reject) => {
      get("/crm/reportVisit/api/log", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //不是经销商登录需要手动选择,所有不分页
  getSysAllSaleNameList(data) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };

    return new Promise((resolve, reject) => {
      get("/crm/agent/api/list", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //我的经销商分页
  getAgentList(data) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };

    return new Promise((resolve, reject) => {
      get("/crm/agent/api/page", data, header).then(res => {
        resolve(res.data);
      });
    });
  }
  //我的经销商详情
  getAgentDetail(id) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };
    return new Promise((resolve, reject) => {
      get(`/crm/agent/api/${id}/info`, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //市场开发店铺类型下拉
  getType(type) {
    let header = { "yui3-token": wx.getStorageSync("ilike-token") };
    return new Promise((resolve, reject) => {
      get("/crm/syscat/api/listByPcd?cd=" + type, "", header).then(res => {
        resolve(res.data);
      });
    });
  }
  //订单详情里的物流订单列表
  getLogList(data) {
    return new Promise((resolve, reject) => {
      get("/crm/orderExpressInfo/page?query=" + data, "", "").then(res => {
        resolve(res.data.kuaidi);
      });
    });
  }
  //快递公司列表，用于把物流订单列表里的公司拼音转成汉字
  getLogComp() {
    return new Promise((resolve, reject) => {
      get("/sys/cat/listByPcd?cd=kuaidi100Code", "", "").then(res => {
        resolve(res.data.list);
      });
    });
  }
  //根据快递单号获取物流信息
  getLogInfo(data) {
    return new Promise(resolve => {
      get("/crm/kuaidi100/getKuandiInfo", data, "").then(res => {
        resolve(JSON.parse(res.data).data);
      });
    });
  }
  //抢公海
  seaGet(id){
    let header = {
      "yui3-token": wx.getStorageSync("ilike-token"),
    };
    return new Promise(resolve => {
      get("/crm/report/api/poollToMy/"+id, "",header).then(res => {
        resolve(res);
      });
    });
  }
  //图片选择
  chooseImages(type, max) {
    wx.setStorage({
      key: "ifClose",
      data: "no"
    });
    let promise = new Promise((resolve, reject) => {
      let that = this;
      wx.chooseImage({
        count: max || 1, //一次最多可以选择的图片张数
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: type || ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          wx.showLoading({
            title: "上传中..."
          });
          let img = res.tempFilePaths[0];
          resolve(img);
          // that.upLoad(res.tempFilePaths[0])
        },
        fail: function(err) {
          console.log(err);
        },
        complete: function() {}
      });
    });
    return promise;
  }
  //上传操作
  upLoad(imgPath) {
    return new Promise((resolve, reject) => {
      let that = this;
      //上传文件
      wx.uploadFile({
        url: config.serverURL + "/general/oss/upload",
        filePath: imgPath,
        name: "img0",
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function(res) {
          let img = JSON.parse(res.data).data;

          resolve(img);
        },
        fail: function(res) {
          wx.showModal({
            title: "错误提示",
            content: res.msg,
            showCancel: false,
            success: function(res) {}
          });
        },
        complete: function() {
          wx.hideLoading();
        }
      });
    });
  }
}

export { api };
