import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from "vue"
import App from "./App.vue"

import router from "./router"
import store from "./store"
import axios from "axios"
import Toaster from "@meforma/vue-toaster"

import FieldErrorMessage from "./components/global/FieldErrorMessage.vue"
import ConfirmationDialog from "./components/global/ConfirmationDialog.vue"
import InputDialog from "./components/global/InputDialog.vue"
import Pagination from "./components/global/Pagination.vue"
import VueGoogleCharts from "vue-google-charts"
import VueSocketIO from "vue-3-socket.io"

const apiDomain = process.env.VUE_APP_API_DOMAIN
const wsConnection = process.env.VUE_APP_WS_CONNECTION

let toastOptions = {
  position: "top",
  timeout: 3000,
  pauseOnHover: true,
}

const socketIO = new VueSocketIO({
  debug: false,
  connection: wsConnection,
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
})

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Toaster, toastOptions)
  .use(VueGoogleCharts)
  .use(socketIO)

axios.defaults.baseURL = `${apiDomain}/api`

app.config.globalProperties.$axios = axios


app.config.globalProperties.$serverUrl = apiDomain


app.component("field-error-message", FieldErrorMessage)
app.component("confirmation-dialog", ConfirmationDialog)
app.component("input-dialog", InputDialog)
app.component("pagination", Pagination)

store.$toast = app.$toast
store.$socket = socketIO.io
app.mount("#app")
