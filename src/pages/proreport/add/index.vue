<template>
  <div class="pro-report">
    <div class="report-wrap">
      <div class="searchComp" v-if="searchShow">
        <div class="content">
          <span class="iconfont" @click="closeSearch">&#xe7c6;</span>
          <input
            placeholder="请输入联系人"
            v-model="compName"
            maxlength="100"
          />
          <div class="list" v-if="linkedList.length > 0">
            <p
              v-for="(item, index) in linkedList"
              :key="index"
              @click="chooseComp(item)"
            >
              {{ item.name + " (电话：" + item.linkPhone + ")" }}
            </p>
          </div>
          <p class="noData" v-else>— 没有相关数据 —</p>
        </div>
      </div>
      <div class="search">
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程名称：</text>
          <input
            type="text"
            v-model="form.projectName"
            placeholder="请输入工程名称"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程类型：</text>
          <picker
            @change="changeProjectType"
            :range="projectTypeList"
            range-key="nm"
          >
            <view class="picker">{{
              form.projectType ? form.projectType : " 请选择工程类型"
            }}</view>
            <span class="iconfont">&#xe60f;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程所在区域：</text>
          <div class="addr">
            <addr-select
              @changeAddr="changeAddr"
              :disabled="disabled"
              ref="addr"
            ></addr-select>
          </div>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程详细地址：</text>
          <input
            type="text"
            v-model="form.projectAddress"
            placeholder="请输入工程详细地址"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>报备人：</text>
          <input
            type="text"
            v-model="form.projectFollowMan"
            placeholder="请输入报备人"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>申报时间：</text>
          <picker
            mode="date"
            :value="reportTime"
            disabled="true"
            @change="reportDateChange"
          >
            <view class="picker">{{ reportTime }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>经销商名称：</text>
          <!-- 赋值自己 -->
          <picker
            @change="changeSaleName"
            :range="saleList"
            range-key="name"
            :disabled="canPicker"
          >
            <view class="picker">{{ form.saleName ? form.saleName : "" }}</view>
            <span class="iconfont">&#xe60f;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>异地工程：</text>
          <radio-group class="radio-group" @change="outTownChange">
            <label class="radio" v-for="(item, index) in items" :key="index">
              <radio :value="item.name" :checked="item.checked" />
              {{ item.value }}
            </label>
          </radio-group>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>项目负责人：</text>
          <button plain="true" @click="showSearch">
            {{ form.projectLeader ? form.projectLeader : "请输入项目负责人" }}
          </button>
          <i
            class="iconfont"
            @click="toPage('../../personal/linkedadd/main?type=add')"
            >&#xe605;</i
          >
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>职务：</text>
          <input
            type="text"
            v-model="form.leaderPost"
            placeholder="请输入职务"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>联系电话：</text>
          <input
            type="number"
            maxlength="11"
            v-model="form.leaderLinkPhone"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
          />
        </div>
        <!-- <div>
          <span class="iconfont">&#xe69f;</span>
          <text>总投资额：</text>
          <input
            type="number"
            v-model="form.totalInvestAmount"
            placeholder="请输入总投资金额"
            placeholder-style="color:#999;"
          />
          <i>万元</i>
        </div> -->
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程现状：</text>
          <picker
            @change="changeProjectStatus"
            :range="proStatusList"
            range-key="nm"
          >
            <view class="picker">{{
              projectStatusNm ? projectStatusNm : "请选择工程现状"
            }}</view>
            <span class="iconfont">&#xe60f;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>主要产品类型：</text>

          <checkbox-group @change="checkboxChange">
            <label
              class="checkbox"
              v-for="(item, index) in mainProductTypeList"
              :key="index"
            >
              <checkbox :value="item.cd" :checked="item.checked" />
              {{ item.nm }}
            </label>
          </checkbox-group>
        </div>
        <!-- <div>
          <text>工程投资金额：</text>
          <input
            type="number"
            v-model="form.projectInvestAmount"
            placeholder="请输入工程投资金额"
            placeholder-style="color:#999;"
          />
          <i>万元</i>
        </div> -->
        <div>
          <text>投标时间：</text>
          <picker
            mode="date"
            :value="form.bidTime"
            start="1980-01-01"
            @change="bidDateChange"
          >
            <view class="picker">{{ form.bidTime ? form.bidTime : "" }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>工程施工时间：</text>
          <picker
            mode="date"
            :value="form.projectOpenTime"
            start="1980-01-01"
            @change="openDateChange"
          >
            <view class="picker">{{
              form.projectOpenTime ? form.projectOpenTime : ""
            }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>预采金额：</text>
          <input
            type="number"
            v-model="form.planPurchaseAmount"
            placeholder="请输入预计采购金额"
            placeholder-style="color:#999;"
          />
          <i>万元</i>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>预采时间：</text>
          <picker
            mode="date"
            start="1980-01-01"
            :value="form.planPurchaseTime"
            @change="planPurchaseChange"
          >
            <view class="picker">{{
              form.planPurchaseTime ? form.planPurchaseTime : ""
            }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div>
          <text>签约时间：</text>
          <picker
            mode="date"
            start="1980-01-01"
            :value="form.signDate"
            @change="signDateChange"
          >
            <view class="picker">{{ form.signDate ? form.signDate : "" }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div>
          <text>实际采购时间：</text>
          <picker
            mode="date"
            start="1980-01-01"
            :value="form.actualPurchaseTime"
            @change="actualPurchaseChange"
          >
            <view class="picker">{{
              form.actualPurchaseTime ? form.actualPurchaseTime : ""
            }}</view>
            <span class="iconfont">&#xe611;</span>
          </picker>
        </div>
        <div class="text-area">
          <span class="iconfont">&#xe69f;</span>
          <text>我方关系情况及技术优势描述：</text>
          <textarea
            auto-height
            v-model="form.remark"
            placeholder="请输入我方关系情况及技术优势描述"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>采购模式：</text>
          <radio-group class="radio-group" @change="purseModelChange">
            <label class="radio" v-for="(item, index) in buyItems" :key="index">
              <radio :value="item.name" :checked="item.checked" />
              {{ item.value }}
            </label>
          </radio-group>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>采购方式：</text>
          <radio-group class="radio-group" @change="purseModeChange">
            <label class="radio" v-for="(item, index) in buyModes" :key="index">
              <radio :value="item.name" :checked="item.checked" />
              {{ item.value }}
            </label>
          </radio-group>
        </div>

        <!-- 采购方式：公开招投标、内部议标、定向采购； -->
      </div>
      <div class="info">
        <span></span>
        <span>工程项目信息来源</span>
      </div>
      <div class="conect">
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>单位身份：</text>
          <picker @change="changeUnitType" :range="unitList" range-key="nm">
            <view class="picker">{{
              unitTypeNm ? unitTypeNm : "请选择单位身份"
            }}</view>
            <span class="iconfont">&#xe60f;</span>
          </picker>
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>公司名称：</text>
          <input
            type="text"
            v-model="unitForm.unitName"
            placeholder="请输入公司名称"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>负责人姓名：</text>
          <input
            type="text"
            v-model="unitForm.unitLeader"
            placeholder="请输入负责人姓名"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span class="iconfont">&#xe69f;</span>
          <text>联系电话：</text>
          <input
            type="number"
            maxlength="11"
            v-model="unitForm.unitLinkPhone"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <text>预计成功率：</text>
          <input
            type="text"
            v-model="unitForm.expectSucceedPercent"
            placeholder-style="color:#999;"
          />%
        </div>
      </div>
      <div class="btn">
        <button plain="true" @click="addUnitList(true)">+ 添加相关单位</button>
      </div>
      <!-- 相关单位 -->
      <div class="rels">
        <div
          class="rel-item"
          v-for="(itemRel, index) in unitFormList"
          :key="itemRel.id"
        >
          <i class="iconfont" @click="deletUnit(index)">&#xe7c6;</i>
          <div
            class="final-item"
            v-for="(item, index1) in itemRel.relsArr"
            :key="item.nm"
          >
            <span v-if="item.required" class="iconfont">&#xe69f;</span>
            <div>{{ item.key }}</div>
            <div>{{ item.value }}</div>
          </div>
        </div>
      </div>
      <div class="info">
        <span></span>
        <span>跟进情况</span>
      </div>
      <div class="follow">
        <div>
          <text>主攻对象：</text>
          <input
            type="text"
            v-model="form.mainTarget"
            placeholder-style="color:#999;"
            placeholder="请输入主攻对象"
          />
        </div>
        <div>
          <text>决策者：</text>
          <input
            type="text"
            v-model="form.decideName"
            placeholder-style="color:#999;"
            placeholder="请输入决策者"
          />
        </div>
      </div>
      <div class="info-bottom">
        <span></span>
        <span>主要竞争对手情况</span>
      </div>
      <div class="compete">
        <div class="compete-item">
          <div>
            <text>名称：</text>
            <input
              type="text"
              v-model="formOne.name"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手名称"
            />
          </div>
          <div>
            <text>优势：</text>
            <input
              type="text"
              v-model="formOne.remark"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手优势"
            />
          </div>
        </div>
        <div class="compete-item">
          <div>
            <text>名称：</text>
            <input
              type="text"
              v-model="formTwo.name"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手名称"
            />
          </div>
          <div>
            <text>优势：</text>
            <input
              type="text"
              v-model="formTwo.remark"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手优势"
            />
          </div>
        </div>
        <div class="compete-item">
          <div>
            <text>名称：</text>
            <input
              type="text"
              v-model="formThree.name"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手名称"
            />
          </div>
          <div>
            <text>优势：</text>
            <input
              type="text"
              v-model="formThree.remark"
              placeholder-style="color:#999;"
              placeholder="请输入竞争对手优势"
            />
          </div>
        </div>
      </div>
    </div>
    <cover-view class="operate" v-if="showBtn">
      <button plain="true" :disabled="disabledBtn" @click="save">保存</button>
      <button plain="true" :disabled="disabledBtn" @click="confirm">
        确定
      </button>
    </cover-view>
  </div>
</template>

<script>
import addrSelect from "@/components/addrSelect";
export default {
  data() {
    return {
      compName: "",
      id: "", //修改报备的时候传值的Id
      reportTime: "",
      canPicker: false,
      disabledBtn: false,
      disabled: false,
      searchShow: false,
      linkedList: [],
      projectTypeList: [],
      mainProductTypeList: [],
      projectStatusNm: "",
      unitTypeNm: "",
      showBtn: true,
      proStatusList: [
        {
          id: 1,
          nm: "土建",
        },
        {
          id: 2,
          nm: "封顶",
        },
        {
          id: 3,
          nm: "外装",
        },
        {
          id: 4,
          nm: "内装",
        },
      ],
      unitList: [
        {
          id: 1,
          nm: "投资方",
        },
        {
          id: 2,
          nm: "总包方",
        },
        {
          id: 3,
          nm: "空调及安装方",
        },
        {
          id: 4,
          nm: "监理方",
        },
        {
          id: 5,
          nm: "装饰设计方",
        },
        {
          id: 6,
          nm: "其它相关方",
        },
      ],
      unitFormList: [],
      saleList: [],
      relsArr: [
        { nm: "unitType", key: "单位身份：", value: "投资方", required: true },
        {
          nm: "unitName",
          key: "公司名称：",
          value: "宁波楚晟光新能源科技有限公司",
          required: true,
        },
        {
          nm: "unitLeader",
          key: "负责人姓名：",
          value: "张子龙",
          required: true,
        },
        {
          nm: "unitLinkPhone",
          key: "联系电话：",
          value: "12345678910",
          required: true,
        },
        {
          nm: "expectSucceedPercent",
          key: "预计成功率：",
          value: "80%",
          required: false,
        },
      ],
      form: {
        saleId: "",
        reportUserId: "", //提交报备的用户账号
        projectLeader: "", //联系人
        leaderLinkPhone: "", //联系电话
        projectName: "", //项目名称
        projectAddress: "", //工程所在地
        projectAreaCode: "",
        projectAreaName: "",
        signDate: "", //签约时间
        projectFollowMan: "", //报备人
        saleName: "",
        isOutTown: "", //默认选中第一个
        leaderPost: "",
        projectType: "",
        // totalInvestAmount: "",
        projectStatus: "",
        mainProduct: "",
        // projectInvestAmount: "",
        bidTime: "",
        projectOpenTime: "",
        planPurchaseAmount: "",
        planPurchaseTime: "",
        signDate: "",
        actualPurchaseTime: "",
        remark: "",
        purchaseModel: "", //默认选中第一个
        mainTarget: "",
        decideName: "",
        saleType: "", //经销商类别
        reportUserType: "", //报备项目的用户类型
        unitList: [],
        competeList: [],
      },
      unitForm: {
        unitType: "",
        unitName: "",
        unitLeader: "",
        unitLinkPhone: "",
        expectSucceedPercent: "",
      },
      formOne: {
        name: "",
        remark: "",
      },
      formTwo: {
        name: "",
        remark: "",
      },
      formThree: {
        name: "",
        remark: "",
      },
      items: [
        { name: "0", value: "否", checked: false },
        { name: "1", value: "是", checked: false },
      ],
      buyItems: [
        { name: "1", value: "甲定甲供", checked: false },
        { name: "2", value: "甲定乙供", checked: false },
        { name: "3", value: "乙定乙供", checked: false },
        { name: "4", value: "乙定甲供", checked: false },
      ],
      buyModes: [
        { name: "1", value: "公开招投标", checked: false },
        { name: "2", value: "内部议标", checked: false },
        { name: "3", value: "定向采购", checked: false },
      ],
    };
  },
  watch: {
    compName(val) {
      console.log("==============" + val);
      this.getLinkedList(val);
    },
  },
  onUnload() {
    this.items.map((item) => (item.checked = false));
    this.buyItems.map((item) => (item.checked = false));
    this.mainProductTypeList = [];
    this.unitForm = {
      unitType: "",
      unitName: "",
      unitLeader: "",
      unitLinkPhone: "",
      expectSucceedPercent: "",
    };
    this.form = {
      saleId: "",
      reportUserId: "",
      projectLeader: "", //联系人
      leaderLinkPhone: "", //联系电话
      projectName: "", //项目名称
      projectAddress: "", //工程所在地
      projectAreaCode: "",
      projectAreaName: "",
      signDate: "", //签约时间
      projectFollowMan: "", //报备人
      saleName: "",
      isOutTown: "",
      leaderPost: "",
      projectType: "",
      // totalInvestAmount: "",
      projectStatus: "",
      mainProduct: "",
      // projectInvestAmount: "",
      bidTime: "",
      projectOpenTime: "",
      planPurchaseAmount: "",
      planPurchaseTime: "",
      signDate: "",
      actualPurchaseTime: "",
      remark: "",
      purchaseModel: "",
      mainTarget: "",
      decideName: "",
      reportType: 1, //工装报备
      saleType: "", //经销商类别
      reportUserType: "", //报备项目的用户类型
      unitList: [],
      competeList: [],
    };
    this.formOne = {
      name: "",
      remark: "",
    };
    this.formTwo = {
      name: "",
      remark: "",
    };
    this.formThree = {
      name: "",
      remark: "",
    };
    this.unitTypeNm = "";
    this.projectStatusNm = "";
    this.unitFormList = [];
    this.searchShow = false;
  },
  onLoad(options) {
    this.id = options.id && options.id !== "undefined" ? options.id : "";
  },
  async onShow() {
    this.unitFormList = [];
    // console.log(this.unitFormList)
    this.disabledBtn = false;
    await this.getUserInfo();
    //我方业务人员报备的项目为埃瑞德公司直采项目，直采项目异地工程选项默认为否
    if (this.userInfo.userType == 1 || this.userInfo.userType == 3) {
      this.$refs.addr.setAddr("埃瑞德");
      this.form.projectAreaName = "埃瑞德";
      this.form.projectAreaCode = "999999";
      this.until.seSave("proAreaName", this.form.projectAreaName);
      this.until.seSave("proAreaCode", this.form.projectAreaCode);

      this.form.isOutTown = 0;
      this.items[0].checked = true;
      this.$set(this.items, 0, this.items[0]);
    }
    await this.getLinkedList();
    await this.getProjectTypeDic();
    if (this.mainProductTypeList.length == 0) {
      await this.getMainProductTypeDic();
    }
    await this.getSaleNameList();
    if (this.id) {
      await this.getReportInfo();
    }
    let { year, month, day, hour, minite } = this.until.formatDate();
    this.reportTime = `${year}-${month}-${day} ${hour}:${minite}`;
    // let areaName = this.until.seGet("proAreaName");
    // if (areaName) {
    //   this.form.projectAreaName = areaName;
    //   this.form.projectAreaCode = this.until.seGet("proAreaCode");
    //   this.$refs.addr.setAddr(areaName);
    // }

    //清空单选，多选或者下拉
    // if (!this.id) {
    //
    // }
  },

  methods: {
    async getReportInfo() {
      let res = await this.api.getSysReportInfo(this.id);
      this.form = this.until.remainLeftObjProp(this.form, res);
      // console.log(this.form)
      this.$refs.addr.setAddr(this.form.projectAreaName);

      // this.reportTime = this.form.reportTime.substring(0, 10);

      this.form.projectOpenTime = this.form.projectOpenTime
        ? this.form.projectOpenTime.substring(0, 10)
        : "";
      this.form.planPurchaseTime = this.form.planPurchaseTime
        ? this.form.planPurchaseTime.substring(0, 10)
        : "";
      this.form.bidTime = this.form.bidTime
        ? this.form.bidTime.substring(0, 10)
        : "";
      this.form.signDate = this.form.signDate
        ? this.form.signDate.substring(0, 10)
        : "";
      this.form.actualPurchaseTime = this.form.actualPurchaseTime
        ? this.form.actualPurchaseTime.substring(0, 10)
        : "";
      // this.form.projectInvestAmount = this.form.projectInvestAmount
      //   ? this.form.projectInvestAmount
      //   : "";
      //日期
      //异地工程

      let isOutTown = this.form.isOutTown ? "1" : "0";
      this.items.forEach((item, index) => {
        if (index == isOutTown) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.items, index, item);
      });

      //异地工程

      this.buyItems.forEach((item, index) => {
        if (index == this.form.purchaseModel) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.buyItems, index, item);
      });

      switch (this.form.projectStatus) {
        case 1:
          this.projectStatusNm = "土建";
          break;
        case 2:
          this.projectStatusNm = "封顶";
          break;
        case 3:
          this.projectStatusNm = "外装";
          break;
        case 4:
          this.projectStatusNm = "内装";
          break;
        default:
          break;
      }
      if (this.form.mainProduct) {
        this.calMainProductType(this.form.mainProduct);
      }
      this.form.competeList.map((item, index) => {
        if (index === 0) {
          this.formOne = {
            name: item.name,
            remark: item.remark,
          };
        } else if (index === 1) {
          this.formTwo = {
            name: item.name,
            remark: item.remark,
          };
        } else {
          this.formThree = {
            name: item.name,
            remark: item.remark,
          };
        }
      });
      // console.log(this.form.unitList)
      if (this.form.unitList.length > 0) {
        this.unitFormList = this.form.unitList;
        this.unitFormShowList = this.unitFormList.map((itemRel) => {
          this.relsArr.map((item) => {
            item.value = itemRel[item.nm];
            if (item.nm == "unitType") {
              switch (itemRel[item.nm]) {
                case 1:
                  item.value = "投资方";
                  break;
                case 2:
                  item.value = "总包方";
                  break;
                case 3:
                  item.value = "空调及安装方";
                  break;
                case 4:
                  item.value = "监理方";
                  break;
                case 5:
                  item.value = "装饰设计方";
                  break;
                case 6:
                  item.value = "其它相关方";
                  break;
                default:
                  break;
              }
            }
            if (item.nm == "expectSucceedPercent") {
              item.value = `${item.value}%`;
            }
          });
          itemRel.relsArr = JSON.parse(JSON.stringify(this.relsArr));
        });
      }

      // console.log(this.unitFormList)
      switch (this.unitForm.unitType) {
        case 1:
          this.unitTypeNm = "投资方";
          break;
        case 2:
          this.unitTypeNm = "总包方";
          break;
        case 3:
          this.unitTypeNm = "空调及安装方";
          break;
        case 4:
          this.unitTypeNm = "监理方";
          break;
        case 5:
          this.unitTypeNm = "装饰设计方";
          break;
        case 6:
          this.unitTypeNm = "其它相关方";
          break;
        default:
          break;
      }
    },
    outTownChange(e) {
      this.form.isOutTown = e.mp.detail.value;
      this.items.forEach((item, index) => {
        if (index == e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.items, index, item);
      });
    },
    purseModelChange(e) {
      this.form.purchaseModel = e.mp.detail.value;
      this.buyItems.forEach((item, index) => {
        if (item.name === e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.buyItems, index, item);
      });
    },
    purseModeChange(e) {
      //需要与后端约定好字段
      // this.form.purchaseModel = e.mp.detail.value;
      this.buyModes.forEach((item, index) => {
        if (item.name === e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.buyModes, index, item);
      });
    },
    //地区更改
    changeAddr(addr) {
      // console.log(addr);
      this.$refs.addr.setAddr("");
      if (addr.area) {
        this.form.projectAreaName = `${addr.provice}-${addr.city}-${addr.area}`;
      } else if (addr.city) {
        this.form.projectAreaName = `${addr.provice}-${addr.city}`;
      } else {
        this.form.projectAreaName = addr.provice;
      }
      // console.log(this.form.projectAreaName);
      this.form.projectAreaCode = addr.code;
      this.until.seSave("proAreaName", this.form.projectAreaName);
      this.until.seSave("proAreaCode", this.form.projectAreaCode);
    },
    chooseComp(item) {
      this.form.projectLeader = item.name;
      this.form.leaderLinkPhone = item.linkPhone;
      // this.$refs.addr.setAddr(item.unitAreaName);
      this.searchShow = false;
      this.showBtn = true;
    },
    showSearch() {
      this.searchShow = true;
      this.showBtn = false;
    },
    closeSearch() {
      this.searchShow = false;
      this.showBtn = true;
    },
    changeProjectType(e) {
      let index = e.mp.detail.value;
      this.form.projectType = this.projectTypeList[index].nm;
    },
    changeSaleName(e) {
      let index = e.mp.detail.value;
      this.form.saleName = this.saleList[index].name;
    },
    changeUnitType(e) {
      // console.log(this.unitForm)
      let index = e.mp.detail.value;
      this.unitTypeNm = this.unitList[index].nm;
      this.unitForm.unitType = this.unitList[index].id;
    },
    changeProjectStatus(e) {
      let index = e.mp.detail.value;
      this.projectStatusNm = this.proStatusList[index].nm;
      this.form.projectStatus = this.proStatusList[index].id;
    },
    async getLinkedList(nm) {
      let param = {
        devUserId: this.userInfo.userId,
      };
      if (this.userInfo.extUserIds) {
        param.extUserIds = this.userInfo.extUserIds;
      }
      if (nm) {
        param.name = nm;
      }
      let data = await this.api.getSysCustomerList(param);
      this.linkedList = data ? data : [];
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      // console.log(this.userInfo);
      if (this.userInfo.agentInfoId) {
        console.log("true");
        this.form.saleId = this.userInfo.agentInfoId;
      } else {
        delete this.form.saleId;
      }
      // console.log(this.form);
      if (this.userInfo.agentInfoName) {
        this.form.saleName = this.userInfo.agentInfoName;
        this.canPicker = true;
      } else {
        this.canPicker = false;
      }

      this.form.reportUserType = this.userInfo.userType;
      this.form.reportUserId = this.userInfo.userId;
      this.form.projectFollowMan = this.userInfo.realName;
      this.form.saleType =
        this.userInfo.saleType && this.userInfo.saleType !== "null"
          ? this.userInfo.saleType
          : "";
    },
    async getProjectTypeDic() {
      this.projectTypeList = await this.api.getBaseDictionaryList({
        cd: "projectType",
      });
    },
    async getMainProductTypeDic() {
      this.mainProductTypeList = await this.api.getBaseDictionaryList({
        cd: "mainProductType",
      });
    },
    async getSaleNameList() {
      let res = await this.api.getSysAllSaleNameList();
      res.map((item) => {
        this.saleList.push(item.crmAgentInfoVo);
      });
    },

    bidDateChange(e) {
      this.form.bidTime = e.mp.detail.value;
    },
    openDateChange(e) {
      this.form.projectOpenTime = e.mp.detail.value;
    },
    planPurchaseChange(e) {
      this.form.planPurchaseTime = e.mp.detail.value;
    },
    signDateChange(e) {
      this.form.signDate = e.mp.detail.value;
    },
    actualPurchaseChange(e) {
      this.form.actualPurchaseTime = e.mp.detail.value;
    },
    checkboxChange: function (e) {
      let arr = e.mp.detail.value;

      this.form.mainProduct = arr.join(",");
      this.calMainProductType(this.form.mainProduct);
    },
    calMainProductType() {
      // console.log('productType')
      // console.log(this.mainProductTypeList)
      this.mainProductTypeList.forEach((item, index) => {
        if (this.form.mainProduct.indexOf(item.cd) > -1) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.mainProductTypeList, index, item);
      });
    },
    verifyForm() {
      let arr = [
        { projectAreaName: "所在区域" },
        { projectAddress: "详细地址" },
        { projectFollowMan: "报备人" },
        // { reportTime: "申报时间" },
        { saleName: "经销商名称" },
        { isOutTown: "异地工程" },
        { projectLeader: "项目负责人" },
        { leaderPost: "职务" },
        { leaderLinkPhone: "联系电话" },
        { projectName: "工程名称" },
        { projectType: "工程类型" },
        // { totalInvestAmount: "总投资额" },
        { projectStatus: "工程现状" },
        { mainProduct: "主要产品类型" },
        { projectOpenTime: "工程施工时间" },
        { planPurchaseAmount: "预采金额" },
        { planPurchaseTime: "预采时间" },
        { remark: "技术优势描述" },
        { purchaseModel: "采购模式" },
      ];

      return this.until.requireVerify(this.form, arr);
    },
    verifyUnitRequire() {
      let arr = [
        { unitType: "单位身份" },
        { unitName: "公司名称" },
        { unitLeader: "负责人姓名" },
        { unitLinkPhone: "联系电话" },
      ];

      return this.until.requireVerify(this.unitForm, arr);
    },
    toPage(url) {
      this.until.aHref(url);
    },
    //删除单位
    deletUnit(index) {
      this.unitFormList.splice(index, 1);
    },
    //添加相关单位
    addUnitList(handle) {
      if (
        this.unitForm.unitType === "" &&
        this.unitForm.unitName === "" &&
        this.unitForm.unitLeader === "" &&
        this.unitForm.unitLinkPhone === "" &&
        this.unitForm.expectSucceedPercent === ""
      ) {
        return true;
      }

      //判断必填字段
      //存在相同公司
      let filters = this.unitFormList.filter(
        (item) => item.unitName === this.unitForm.unitName
      );
      // console.log('添加相关单位2')
      //2019年10月23日 设计部门要求去掉判断
      // if (filters.length > 0) {
      //   this.until.showToast("不要添加已有的公司名称", "none", 500);
      //   return;
      // } else {
      let res = this.verifyUnitRequire();
      if (res) {
        this.until.showToast(res, "none", 400);
        return false;
      } else {
        let regPhoneUnit = this.reg.checkPhone(this.unitForm.unitLinkPhone);
        if (regPhoneUnit !== "ok") {
          this.until.showToast(
            "请在相关单位中填写正确的手机号码格式",
            "none",
            500
          );
          return false;
        }
        // console.log("相关单位");

        this.unitFormList.push(JSON.parse(JSON.stringify(this.unitForm)));
        // console.log(this.unitFormList)
        this.unitFormShowList = this.unitFormList.map((itemRel) => {
          this.relsArr.map((item) => {
            item.value = itemRel[item.nm];
            if (item.nm == "unitType") {
              switch (itemRel[item.nm]) {
                case 1:
                  item.value = "投资方";
                  break;
                case 2:
                  item.value = "总包方";
                  break;
                case 3:
                  item.value = "空调及安装方";
                  break;
                case 4:
                  item.value = "监理方";
                  break;
                case 5:
                  item.value = "装饰设计方";
                  break;
                case 6:
                  item.value = "其它相关方";
                  break;
                default:
                  break;
              }
            }
            if (item.nm == "expectSucceedPercent") {
              item.value = `${item.value}%`;
            }
          });
          itemRel.relsArr = JSON.parse(JSON.stringify(this.relsArr));
        });

        if (handle) {
          this.until.showToast("添加成功", "success", 400);
        }
        setTimeout(() => {
          this.unitForm = {
            unitType: "",
            unitName: "",
            unitLeader: "",
            unitLinkPhone: "",
            expectSucceedPercent: "",
          };
          this.unitTypeNm = "";
        }, 1000);
      }
      //}
      return true;
    },
    moneyCheck() {
      let msg = "";
      // if (isNaN(this.form.totalInvestAmount)) {
      //   msg = "总投资金额必须为数字!";
      // }
      // if (isNaN(this.form.projectInvestAmount)) {
      //   msg = "工程投资金额必须为数字!";
      // }
      if (isNaN(this.form.planPurchaseAmount)) {
        msg = "预采金额必须为数字!";
      }

      return msg;
    },
    async save() {
      this.disabledBtn = true;
      let competeList = [];

      let addSuccess = this.addUnitList(false);
      if (addSuccess) {
        if (this.id) {
          this.form.id = this.id;
        }

        if (this.formOne.name) {
          competeList.push(this.formOne);
        }
        if (this.formTwo.name) {
          competeList.push(this.formTwo);
        }
        if (this.formThree.name) {
          competeList.push(this.formThree);
        }

        if (competeList.length > 0) {
          this.form.competeList = JSON.stringify(competeList);
        }
        this.unitFormList.map((item) => {
          delete item.relsArr;
        });
        if (this.unitFormList.length > 0) {
          this.form.unitList = JSON.stringify(this.unitFormList);
        }
        this.form.reportStatus = -2;
        for (let [k, v] of Object.entries(this.form)) {
          if (!v || v == "" || v == " ") {
            delete this.form[k];
          }
        }
        setTimeout(() => {
          this.disabledBtn = false;
        }, 2000);
        if (this.moneyCheck()) {
          this.until.showToast(this.moneyCheck(), "none", 400);
          return;
        }

        // console.log('保存成功')
        let res = await this.api.sysReportInfoSave(this.form);
        if (res) {
          wx.redirectTo({ url: "../list/main?type=项目报备" });
        }

        this.disabledBtn = false;
      } else {
        this.disabledBtn = false;
      }

      // console.log(this.disabledBtn)
    },
    async confirm() {
      // console.log(this.form)
      this.disabledBtn = true;
      let competeList = [];
      // debugger;
      let addSuccess = this.addUnitList(false); //这里为什么要这样写？
      // console.log("addSuccess:" + addSuccess);
      // let addSuccess = true;
      if (addSuccess) {
        if (this.id) {
          this.form.id = this.id;
        }

        if (this.formOne.name) {
          competeList.push(this.formOne);
        }
        if (this.formTwo.name) {
          competeList.push(this.formTwo);
        }
        if (this.formThree.name) {
          competeList.push(this.formThree);
        }

        if (competeList.length > 0) {
          this.form.competeList = JSON.stringify(competeList);
        }
        this.unitFormList.map((item) => {
          delete item.relsArr;
        });
        this.form.unitList = JSON.stringify(this.unitFormList);

        let msg = this.verifyForm();
        if (msg) {
          this.until.showToast(msg, "none", 400);
          this.disabledBtn = false;
          return;
        } else if (this.unitFormList.length === 0) {
          this.until.showToast("请添加相关单位", "none", 400);
          this.disabledBtn = false;
          return;
        } else {
          let regPhone = this.reg.checkPhone(this.form.leaderLinkPhone);
          if (regPhone !== "ok") {
            this.until.showToast(
              "请在项目报备中输入正确的手机号码格式",
              "none",
              400
            );
            this.disabledBtn = false;
            return;
          } else {
            this.form.reportStatus = 100;
            // console.log(this.form)
            setTimeout(() => {
              this.disabledBtn = false;
            }, 2000);
            if (this.moneyCheck()) {
              this.until.showToast(this.moneyCheck(), "none", 400);
              return;
            }

            // console.log('提交成功')
            // console.log(this.form)
            let res = await this.api.sysReportInfoSave(this.form);
            if (res) {
              wx.redirectTo({ url: "../list/main?type=项目报备" });
            }
          }
        }
        this.disabledBtn = false;
      } else {
        this.disabledBtn = false;
      }
    },
  },
  components: {
    addrSelect,
  },
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.pro-report {
  width: 100%;
  background-color: @backgroundColor;
  .report-wrap {
    padding-bottom: 100rpx;
    .searchComp {
      position: fixed;
      width: 100vw;
      height: 100vh;
      z-index: 2199;
      background: rgba(0, 0, 0, 0.8);

      .content {
        width: 75vw;
        margin: 140rpx auto 0;
        border-radius: 10rpx;
        background: #ffffff;
        padding-top: 50rpx;
        padding-bottom: 20rpx;
        position: relative;
        span {
          position: absolute;
          right: 5rpx;
          top: 5rpx;
          width: 40rpx;
          height: 40rpx;
          font-size: 40rpx;
        }
        input {
          width: 80%;
          margin: 0 auto 40rpx;
          border-bottom: 1px solid @borderColor;
        }
        .list {
          max-height: 500rpx;
          width: 80%;
          margin: 0 auto;
          overflow-y: scroll;
          p {
            padding: 10rpx 0;
          }
        }
        > p {
          text-align: center;
        }
      }
    }
    .search,
    .conect,
    .follow {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      padding-left: 40rpx;
      background-color: #fff;
      > div {
        position: relative;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 1rpx solid #ddd;
        &:nth-last-of-type(1) {
          border-bottom: 0;
          height: 100rpx;
        }
        > span {
          position: absolute;
          top: 40%;
          left: -30rpx;
          color: #f00;
        }
        > text {
          width: 220rpx;
          font-size: 30rpx;
          color: #666;
        }
        i {
          margin-right: 40rpx;
        }
        input,
        picker,
        textarea,
        checkbox-group {
          flex: 1;
        }
        button {
          flex: 1;
          text-align: left;
          background: #fff;
          color: #666666;
          border: 0;
        }
        picker {
          position: relative;
          span {
            position: absolute;
            right: 40rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          i {
            position: absolute;
            right: 100rpx;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .addr {
          flex: 1;
          display: flex;
          display: -webkit-flex;
          span {
            flex: 1;
          }
        }
        radio-group,
        checkbox-group {
          display: flex;
          display: -webkit-flex;
          flex-flow: row wrap;
          > label {
            width: 50%;
            &:nth-of-type(n + 3) {
              margin-top: 12rpx;
            }
          }
        }
        checkbox-group {
          > label {
            &:nth-last-of-type(1) {
              width: 100%;
            }
          }
        }
      }
      .text-area {
        align-items: flex-start;
        textarea {
          z-index: 99;
          flex: 1;
          background: #fff;
          min-height: 189rpx;
          padding: 15rpx;
          margin-right: 48rpx;
        }
      }
    }
    .conect,
    .follow {
      > div {
        &:nth-last-of-type(1) {
          height: auto;
        }
      }
    }
    .conect {
      > div {
        &:nth-last-of-type(1) {
          input {
            flex: 0 0 auto;
            width: 140rpx;
          }
        }
      }
    }
    .info,
    .info-bottom {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 20rpx;
      padding: 30rpx 0 30rpx 40rpx;
      background-color: #fff;
      border-bottom: 1rpx solid #ddd;
      span {
        &:nth-of-type(1) {
          width: 10rpx;
          background-color: @btnColor;
          height: 30rpx;
        }
        &:nth-last-of-type(1) {
          flex: 1;
          margin-left: 30rpx;
        }
      }
    }
    .info-bottom {
      border-bottom: 0;
    }
    .btn {
      width: 100%;
      background-color: #fff;
      border-top: 1rpx solid #ddd;
      button {
        border: 0;
        width: 100%;
        text-align: center;
        padding: 30rpx 0;
        color: @btnColor;
        font-size: 30rpx;
      }
    }

    .rel-item {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      padding: 30rpx 65rpx;
      background-color: #fff;
      position: relative;
      > i {
        position: absolute;
        right: 10rpx;
        top: 10rpx;
        z-index: 99;
        font-size: 40rpx;
        width: 40rpx;
        height: 40rpx;
      }
      > div {
        position: relative;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-top: 20rpx;
        &:nth-of-type(1) {
          margin-top: 0;
        }
        span {
          position: absolute;
          top: 20%;
          left: -40rpx;
          color: #f00;
        }
        div {
          &:nth-of-type(1) {
            width: 200rpx;
          }
          &:nth-last-of-type(1) {
            flex: 1;
          }
        }
      }
    }
    .rels {
      margin-top: 20rpx;
    }

    .compete {
      padding: 0 40rpx 40rpx;
      background-color: #fff;
      .compete-item {
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        border: 1rpx solid #ddd;
        margin-bottom: 40rpx;
        > div {
          flex: 1;
          display: flex;
          display: -webkit-flex;
          flex-flow: row nowrap;
          padding: 20rpx 0;
          &:nth-of-type(1) {
            border-bottom: 1rpx solid #ddd;
          }
          text {
            text-align: center;
            width: 200rpx;
          }
          input {
            flex: 1;
          }
        }
      }
    }
  }
  .operate {
    button {
      &:nth-of-type(1) {
        border-top: 1rpx solid @btnColor;
        background-color: #fff;
        color: #333;
      }
    }
  }
}
</style>
