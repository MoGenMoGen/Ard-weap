<template>
  <div class="doc-detail">
    <div class="content">
      <web-view v-if="iosShow" :src="saleDoc.saleAttach"></web-view>
      <button @click="getSaleDataInfo">在线查看文档</button>
    </div>
    <div class="operate">
      <button plain="true" @click="saveFiles">下载</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      saleDoc: {},
      content: ``,
      system: "",
      iosShow: false,
      savedFilePath: ""
    };
  },
  onLoad(options) {
    this.id = options.id;
    // this.getSaleDataInfo();
  },
  onShow() {
    this.iosShow = false
  },
  methods: {

    async getSaleDataInfo() {
      wx.showLoading({
        title: '加载中',
      })
      this.saleDoc = await this.api.getSysSaleDataInfoById(this.id);
      //判断是ios还是Android
      console.log(this.saleDoc);
      var that = this;
      wx.getSystemInfo({
        success: function(res) {

          console.log(res.system);
          that.system = res.system;
          if (res.system.indexOf("iOS") > 0) {
            wx.hideLoading()
            that.iosShow = true;
          } else {
            wx.downloadFile({
              url: that.saleDoc.saleAttach,
              success: function(res) {
                console.log(res);
                var Path = res.tempFilePath; //返回的文件临时地址，用于后面打开本地预览所用
                wx.openDocument({
                  filePath: Path,
                  success: function(res) {
                    wx.hideLoading()
                    console.log("打开成功");
                  }
                });
              },
              fail: function(res) {
                wx.hideLoading()
                console.log(res);
              }
            });
          }
        }
      });
    },
    saveFiles(e) {
      let that = this;
      const fileName = `${that.saleDoc.content}.pdf`; //获取页面要下载的文件名
      wx.downloadFile({
        url: that.saleDoc.saleAttach,
        success: res => {
          var filePath = res.tempFilePath;
          let manager = wx.getFileSystemManager(); //获取全局唯一的文件管理器
          //判断目录是否存在
          manager.access({
            path: `${wx.env.USER_DATA_PATH}/download`,
            success: res => {
              // console.log('已存在path对应目录',res)
              //保存文件之前查看是否存在此文件
              manager.access({
                path: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                success(res) {
                  that.until.showToast("文件已存在", "none", 500);
                  return false;
                },
                fail(err) {
                  that.until.showToast("不存在此文件", "none", 500);
                  manager.saveFile({
                    tempFilePath: filePath, //filePath为保存到本地的临时路径
                    filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                    success: res => {
                      that.getLocalFiles(manager, that);
                    },
                    fail: err => {
                      console.log(err);
                    }
                  });
                }
              });
            },
            fail: err => {
              that.until.showToast("不存在path对应目录", "none", 500);
              //创建保存文件的目录
              manager.mkdir({
                dirPath: `${wx.env.USER_DATA_PATH}/download`,
                recursive: false,
                success: res => {
                  //将临时文件保存到目录  /download
                  manager.saveFile({
                    tempFilePath: filePath,
                    filePath: `${wx.env.USER_DATA_PATH}/download/${fileName}`,
                    success: res => {
                      // console.log(res)
                      that.until.showToast("保存成功", "success", 500);
                      that.getLocalFiles(manager, that);
                    },
                    fail: err => {
                      that.until.showToast(err, "none", 500);
                    }
                  });
                },
                fail: err => {
                  that.until.showToast(err, "none", 500);
                }
              });
            }
          });
        },
        fail: err => {
          that.until.showToast("下载失败", "none", 500);
        }
      });
    }
  }
};
</script>

<style lang="less">
@import url("../../../css/common.less");
.doc-detail {
  width: 100%;
  background-color: @backgroundColor;
  .content {
    padding: 30rpx;
    background-color: #fff;
    >button{
      border: 1px solid @color;
      color: @color;
      background: #ffffff;
      border-radius: 10rpx;
      padding: 50rpx;
    }
  }
}
</style>
