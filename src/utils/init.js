import { until, reg } from "@/utils/until";
import { api } from "@/utils/api";
import query from "@/utils/query";

import "../css/common.css"
export default {
  install(Vue) {
    Vue.prototype.until = new until();
    Vue.prototype.reg = new reg();
    Vue.prototype.api = new api();
    Vue.prototype.query = query;
  }
};
