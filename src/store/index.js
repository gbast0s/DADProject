import { createStore } from "vuex"
import axios from "axios"
export default createStore({
  state: {
    user: null,
    loaded: 0,
    lastTransactions: [],
    paymentTypes: [],

    showChat: false,
    messages: [],
    roomName: "",
    showMessage: true,
  },
  mutations: {
    resetMessage(state) {
      state.showChat = false;
      state.messages = [];
      state.roomName = "";
      state.showMessage = true;
    },
    resetUser(state) {
      if (state.user) {
        this.$socket.emit('logged_out', state.user)
        state.user = null
      }
    },
    setUser(state, loggedInUser) {
      state.user = loggedInUser
    },
    setDebit(state, debit) {
      state.user.max_debit = debit
    },
    setLoaded(state, load) {
      state.loaded = load
    },
    setTransactions(state, transactions) {
      state.lastTransactions = transactions
    },
    resetTransactions(state) {
      state.lastTransactions = null
    },
    setPaymentTypes(state, paymentTypes) {
      state.paymentTypes = paymentTypes
    },
    resetPaymentTypes(state) {
      state.paymentTypes = null
    },
    setShowChat(state,value) {
      state.showChat=value;
    },
    setMessages(state,value) {
      state.messages.push(value);
    },
    setRoomName(state,value) {
      state.roomName=value;
    },
    setShowMessage(state,value) {
      state.showMessage=value;
    },
  },
  actions: {
    async restoreToken(context) {
      let storedToken = sessionStorage.getItem("Auth_key")
      if (storedToken) {
        axios.defaults.headers.common.Authorization = storedToken
        return storedToken
      }
      delete axios.defaults.headers.common.Authorization
      context.commit("resetUser", null)
      return null
    },
    async loadUser(context) {
      try {
        let response = await axios.get("users/me")
        context.commit("setUser", response.data.data)
        context.commit("setLoaded", 1)
        this.$socket.emit('logged_in', response.data.data)

      } catch (error) {
        delete axios.defaults.headers.common.Authorization
        context.commit("resetUser", null)
        throw error
      }
    },
    async refresh(context) {
      let userPromise = context.dispatch("loadUser")

      await userPromise
    },
    async logout(context) {
      try {
        await axios.post("logout")
      } finally {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem("Auth_key")
        context.commit("resetUser", null)
      }
    },
    resetOwnUserDeleted(context) {
      sessionStorage.removeItem("Auth_key")
      delete axios.defaults.headers.common.Authorization
      context.commit("resetUser", null)
    },
    async loadLastTransactions(context, user) {
      if (user && user.user_type == "V") {
        try {
          let response = await axios.get(
            "vcards/" + user.id + "/transactions",
            {
              params: {
                paginated: "N",
              },
            },
          )
          context.commit("setTransactions", response.data.data)
        } catch (error) {
          context.commit("resetTransactions", null)
          throw error
        }
      }
    },
    async loadPaymentTypes(context) {
      try { 
        let response = await axios.get("paymenttypes")
        context.commit("setPaymentTypes", response.data.data)
      } catch (error) {
        context.commit("resetPaymentTypes", null)
        throw error
      }
    },
    async updateDebit(context, vcard) {
      if (context.state.user.id == vcard.phone_number) {
        context.commit("setDebit", vcard.max_debit)
      }
    },
    resetMessage(context) {
      context.commit("resetMessage")
    }
  },
})
