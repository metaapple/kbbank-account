import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./styles/index.css";

/* FontAwesome setup */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, faHouse, faChartPie, faWallet, faPlus, faGear, 
  faArrowUp, faArrowDown, faList, faCircleMinus, faMoneyBillTrendUp, faPiggyBank 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser, faHouse, faChartPie, faWallet, faPlus, faGear, 
  faArrowUp, faArrowDown, faList, faCircleMinus, faMoneyBillTrendUp, faPiggyBank
)

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia());
app.use(router);
app.mount("#app");
