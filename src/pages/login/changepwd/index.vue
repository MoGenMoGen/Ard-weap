<template>
  <div class="input-content">
    <div class="input">
      <div>
        <text>原密码</text>
        <input
          type="password"
          v-model="form.oldPassWord"
          placeholder="请输入原密码"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>新密码</text>
        <input
          type="password"
          v-model="form.newPassWord"
          placeholder="请输入新密码"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>确认新密码</text>
        <input
          type="password"
          v-model="form.confirmPassWord"
          placeholder="请再次输入新密码"
          placeholder-style="color:#999;"
        />
      </div>
    </div>

    <!-- 新增 -->
    <div class="operate">
      <button plain="true" @click="confirm">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "add",
      form: {
        oldPassWord: "",
        newPassWord: "",
        confirmPassWord: ""
      }
    };
  },
  onUnload() {
    this.form = {
      oldPassWord: "",
      newPassWord: "",
      confirmPassWord: ""
    };
  },
  methods: {
    confirm() {
      this.api.sysResetPassword(this.form);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.input-content {
  height: 100%;
}
</style>
