<template>
  <confirmation-dialog-chat
    ref="confirmationDialogChat"
    confirmationBtn="End chat"
    msg="Do you really want to leave the help chat?"
    @confirmed="closeChat"
  ></confirmation-dialog-chat> 
  <nav
    class="
      navbar navbar-expand-md navbar-dark
      bg-dark
      sticky-top
      flex-md-nowrap
      p-0
      shadow
    "
  >
    <div class="container-fluid" style="padding-left: 0 !important">
      <router-link
        v-if="!user"
        class="navbar-brand col-md-3 col-lg-2 me-0 px-3"

        :to="{name: 'Home'}"
      >
        <img
          src="./assets/logo.png"
          alt=""
          height="35"
          class="d-inline-block align-text-top"
        />
      </router-link>
      <router-link
        v-if="user"
        class="navbar-brand col-md-3 col-lg-2 me-0 px-3"

        :to="{name: 'Dashboard'}"
      >
        <img
          src="./assets/logo.png"
          alt=""
          height="35"
          class="d-inline-block align-text-top"
        />
      </router-link>
      <label
        class="text-light balance small"
        v-if="user ? user.user_type == 'V' : false"
        ><label class="label">Balance:</label> {{ user.balance }} €</label
      >
      <button
        id="buttonSidebarExpandId"
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
        v-if="user"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <template v-if="user">
            <label
              class="text-light balance"
              v-if="user ? user.user_type == 'V' : false"
              ><label class="label">Balance:</label> {{ user.balance }}€</label
            >
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  :src="userPhotoUrl"
                  class="rounded-circle z-depth-0 avatar-img"
                  alt="avatar image"
                />
                <span class="avatar-text">{{ userName }}</span>
              </a>
              <ul
                class="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li v-if="user ? user.user_type == 'V' : false">
                  <router-link
                    class="dropdown-item"
                    :class="{
                      active:
                        $route.name == 'EditingVcard' &&
                        $route.params.phone_number == user.id,
                    }"
                    :to="{
                      name: 'EditingVcard',
                      params: { phone_number: user.id },
                    }"
                    ><i class="bi bi-person-square"></i>Profile
                  </router-link>
                </li>
                <li v-if="user ? user.user_type == 'A' : false">
                  <router-link
                    class="dropdown-item"
                    :class="{
                      active:
                        $route.name == 'EditingAdmin' &&
                        $route.params.id == user.id,
                    }"
                    :to="{ name: 'EditingAdmin', params: { id: user.id } }"
                    ><i class="bi bi-person-square"></i>Profile
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    :class="{
                      active:
                        $route.name == 'Password' &&
                        $route.params.userid == user.id,
                    }"
                    :to="{ name: 'Password', params: { userid: user.id } }"
                    ><i class="bi bi-key-fill"></i>Change password
                  </router-link>
                </li>
                <li v-if="user ? user.user_type == 'V' : false">
                  <router-link
                    class="dropdown-item"
                    :class="{
                      active:
                        $route.name == 'Code' &&
                        $route.params.userid == user.id,
                    }"
                    :to="{ name: 'Code', params: { userid: user.id } }"
                    ><i class="bi bi-shield-check"></i>Change Confirmation Code
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" @click.prevent="logout"
                    ><i class="bi bi-arrow-right"></i>Logout</a
                  >
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <template v-if="user">
        <nav
          id="sidebarMenu"
          class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li>
                <router-link
                  class="nav-link"
                  :class="{ active: $route.name === 'Dashboard' }"
                  :to="{ name: 'Dashboard' }"
                  ><i class="bi bi-house"></i>
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item" v-if="user ? user.user_type == 'A' : false">
                <router-link
                  class="nav-link w-100 me-3"
                  :class="{ active: $route.name === 'Vcards' }"
                  :to="{ name: 'Vcards' }"
                >
                  <i class="bi bi-credit-card"></i>
                  Vcards
                </router-link>
              </li>

              <li class="nav-item" v-if="user ? user.user_type == 'V' : false">
                <router-link
                  class="nav-link w-100 me-3"
                  :class="{ active: $route.name === 'Transactions' }"
                  :to="{ name: 'Transactions' }"
                >
                  <i class="bi bi-files"></i>
                  Transactions
                </router-link>
              </li>

              <li class="nav-item" v-if="user ? user.user_type == 'A' : false">
                <router-link
                  class="nav-link w-100 me-3"
                  :class="{ active: $route.name === 'Admins' }"
                  :to="{ name: 'Admins' }"
                >
                  <i class="bi bi-person-badge"></i>
                  Administrators
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link w-100 me-3"
                  :class="{ active: $route.name === 'Categories' }"
                  :to="{ name: 'Categories' }"
                >
                  <i class="bi bi-boxes"></i>
                  Categories
                </router-link>
              </li>
            </ul>
            <div v-if="user ? user.user_type == 'V' : null">
              <h6
                class="
                  sidebar-heading
                  d-flex
                  justify-content-between
                  align-items-center
                  px-3
                  mt-4
                  mb-1
                  text-muted
                "
              >
                <span>My Last Transactions</span>
                <router-link
                  class="link-secondary"
                  :to="{ name: 'NewTransaction' }"
                  title="Create a New Transaction"
                  ><i class="bi bi-xs bi-plus-circle"></i>
                </router-link>
              </h6>
              <ul class="nav flex-column mb-2">
                <li
                  class="nav-item"
                  v-for="transaction in lastTransactions"
                  :key="transaction.id"
                >
                  <a class="nav-link">
                    <i class="bi bi-receipt"></i>
                    {{
                      transaction.type +
                      " - " +
                      transaction.payment_type +
                      " - " +
                      transaction.value +
                      "€"
                    }}
                  </a>
                </li>
              </ul>
            </div>
            <div
              class="ask-help"
              v-if="user ? user.user_type == 'V' && !showChat : null"
            >
              <button
                type="button"
                class="btn btn-light px-5 help"
                @click="askHelp"
              >
                <i class="bi bi-headset"></i>
                Ask for help
              </button>
            </div>
            <div class="d-block d-md-none">
              <h6
                class="
                  sidebar-heading
                  d-flex
                  justify-content-between
                  align-items-center
                  px-3
                  mt-4
                  mb-1
                  text-muted
                "
              >
                <span>User</span>
              </h6>
              <ul class="nav flex-column mb-2">
                <template v-if="!user">
                  <li class="nav-item">
                    <router-link
                      class="nav-link"
                      :class="{ active: $route.name === 'Register' }"
                      :to="{ name: 'Register' }"
                      ><i class="bi bi-person-circle"></i>
                      Register
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link
                      class="nav-link"
                      :class="{ active: $route.name === 'Login' }"
                      :to="{ name: 'Login' }"
                      ><i class="bi bi-box-arrow-in-right"></i>
                      Login
                    </router-link>
                  </li>
                </template>
                <template v-if="user">
                  <li class="nav-item dropdown">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdownMenuLink2"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        :src="userPhotoUrl"
                        class="rounded-circle z-depth-0 avatar-img"
                        alt="avatar image"
                      />
                      <span class="avatar-text">{{ userName }}</span>
                    </a>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink2"
                    >
                      <li v-if="user ? user.user_type == 'V' : false">
                        <router-link
                          class="dropdown-item"
                          :class="{
                            active:
                              $route.name == 'EditingVcard' &&
                              $route.params.phone_number == user.id,
                          }"
                          :to="{
                            name: 'EditingVcard',
                            params: { phone_number: user.id },
                          }"
                          ><i class="bi bi-person-square"></i>Profile
                        </router-link>
                      </li>
                      <li v-if="user ? user.user_type == 'A' : false">
                        <router-link
                          class="dropdown-item"
                          :class="{
                            active:
                              $route.name == 'EditingAdmin' &&
                              $route.params.id == user.id,
                          }"
                          :to="{
                            name: 'EditingAdmin',
                            params: { id: user.id },
                          }"
                          ><i class="bi bi-person-square"></i>Profile
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          class="dropdown-item"
                          :class="{
                            active:
                              $route.name == 'Password' &&
                              $route.params.userid == user.id,
                          }"
                          :to="{
                            name: 'Password',
                            params: { userid: user.id },
                          }"
                          ><i class="bi bi-key-fill"></i>Change password
                        </router-link>
                      </li>
                      <li v-if="user ? user.user_type == 'V' : false">
                        <router-link
                          class="dropdown-item"
                          :class="{
                            active:
                              $route.name == 'Code' &&
                              $route.params.userid == user.id,
                          }"
                          :to="{ name: 'Code', params: { userid: user.id } }"
                          ><i class="bi bi-shield-check"></i>Change Confirmation
                          Code
                        </router-link>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a class="dropdown-item" @click.prevent="logout"
                          ><i class="bi bi-arrow-right"></i>Logout</a
                        >
                      </li>
                    </ul>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div
            v-if="showChat"
            v-bind:style="{ opacity: opacity }"
            class="
              container
              border
              rounded
              text-black
              chat
              bg-light
              border-secondary
              computer
            "
          >
            <div @click="toggleChat" class="showMessage border-bottom">
              <i
                v-bind:class="{
                  'bi bi-chevron-compact-down': showMessage,
                  'bi bi-chevron-up': !showMessage,
                }"
              ></i>
            </div>

            <div
              v-show="showMessage"
              class="overflow-auto messages"
              ref="scrollable"
            >
              <div v-for="message in messages" :key="message" class="message">
                <b v-if="message.user.user_type == 'A'"
                  >{{ message.user.name }} :</b
                >
                <b v-if="message.user.user_type == 'V'"
                  >{{ message.user.name }} &nbsp;({{ message.user.id }}):</b
                >
                <p class="border-bottom mb-3">{{ message.message }}</p>
              </div>
            </div>
            <div class="input-group">
              <input
                type="text"
                placeholder="Type message (ENTER)"
                v-model="inputMessage"
                @keyup.enter="sendMessage()"
                class="form-control chatInput"
                maxlength="255"
                aria-describedby="cross"
              />
              <div
                v-if="user ? user.user_type == 'A' : false"
                class="
                  input-group-append
                  chatButton
                  d-inline-flex
                  justify-content-center
                  align-items-center
                "
                title="End Chat"
                @click="chatDialog"
              >
                <i class="bi bi-x-square" id="cross"></i>
              </div>
            </div>
          </div>
        </nav>
      </template>
      <main :class="user ? 'col-md-9 ms-sm-auto col-lg-10 px-md-4' : ''">
        <router-view></router-view>
      </main>
      <div
        v-if="showChat"
        v-bind:style="{ opacity: opacity }"
        class="
          container
          border
          rounded
          text-black
          chat
          bg-light
          border-secondary
          mobile
          d-none
        "
      >
        <div @click="toggleChat" class="showMessage border-bottom">
          <i
            v-bind:class="{
              'bi bi-chevron-compact-down': showMessage,
              'bi bi-chevron-up': !showMessage,
            }"
          ></i>
        </div>

        <div
          v-show="showMessage"
          class="overflow-auto messages"
          ref="scrollableMobile"
        >
          <div v-for="message in messages" :key="message" class="message">
            <b>{{ message.user.name }} :</b>
            <p class="border-bottom mb-3">{{ message.message }}</p>
          </div>
        </div>
        <div class="input-group">
          <input
            type="text"
            placeholder="Type message (ENTER)"
            v-model="inputMessage"
            @keyup.enter="sendMessage()"
            class="form-control chatInput"
            maxlength="255"
            aria-describedby="cross"
          />
          <div
            v-if="user ? user.user_type == 'A' : false"
            class="
              input-group-append
              chatButton
              d-inline-flex
              justify-content-center
              align-items-center
            "
            @click="chatDialog"
            title="End Chat"
          >
            <i class="bi bi-x-square" id="cross"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmationDialogChat from "./components/global/ConfirmationDialogChat.vue";

export default {
  components: {
    ConfirmationDialogChat,
  },
  data() {
    return {
      inputMessage: "",
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.$store.dispatch("loadLastTransactions", newValue);
          this.$store.dispatch("loadPaymentTypes");
        }
      },
    },
  },
  methods: {
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.cleanChat();
          this.$toast.success("User has logged out of the application.");
          this.$router.push({ name: "Home" });
        })
        .catch(() => {
          this.$toast.error("There was a problem logging out of the application!");
          this.$router.push({ name: "Home" });
        });
    },
    askHelp() {
      this.$socket.emit("askHelp", this.user);
    },
    sendMessage() {
      if (this.inputMessage != null && this.inputMessage != "")
        this.$socket.emit(
          "chatMessage",
          this.roomName,
          this.user,
          this.inputMessage
        );
      this.inputMessage = "";
    },
    toggleChat() {
      this.$store.commit("setShowMessage", !this.showMessage);
    },
    cleanChat() {
      this.$store.dispatch("resetMessage");
    },
    chatDialog() {
      let dlg = this.$refs.confirmationDialogChat;
      dlg.show();
    },
    closeChat() {
      this.$socket.emit("adminLeave", this.roomName, this.user);
    },
  },
  sockets: {
    newCategory(category) {
      this.$toast.show(
        `A new Category was created (#${category.id} : ${category.name})`
      );
    },
    updateCategory(category) {
      this.$toast.show(
        `The Category was updated (#${category.id} : ${category.name})`
      );
    },
    deletingCategory(category) {
      this.$toast.show(
        `The Category (#${category.id} : ${category.name}) was deleted`
      );
    },
    newAdmin(admin) {
      this.$toast.show(
        `A new Admin was created (#${admin.id} : ${admin.name})`
      );
    },
    updateAdmin(admin) {
      if (admin.id == this.user.id) {
        this.$toast.show("Your account has been updated");
        this.$store.dispatch("refresh");
      } else {
        this.$toast.show(`The Admin was updated (#${admin.id} : ${admin.name})`);
      }
    },
    deletingAdmin(admin) {
      if (admin.id == this.user.id) {
        this.$store.dispatch("resetOwnUserDeleted");
        this.$router.push({ name: "Home" });
        this.$toast.show("Your account has been deleted");
      } else {
        this.$toast.show(
          `The Admin (#${admin.id} : ${admin.name}) was deleted`
        );
      }
    },
    newTransaction(context) {
      let transaction = context[0];
      let user = context[1];
      this.$store.dispatch("refresh");
      //TODO: Como tenho watch do user aqui e na dashboard, basta atualizar o user que tudo dá refresh
      if (transaction.vcard) {
        this.$toast.show(
          `A Transaction has been made to your account from #${transaction.payment_reference} with a value of ${transaction.value}€`
        );
      } else {
        this.$toast.show(
          `A Transaction has been made to your account from #${user.id} with a value of ${transaction.value}€`
        );
      }
    },
    blockedUser(vcard) {
      if (this.user.user_type == "V") {
        this.logout();
        this.$toast.show("Your account has been blocked");
      } else {
        this.$toast.show(
          `The Vcard (#${vcard.phone_number} : ${vcard.name}) was ${
            vcard.blocked ? "blocked" : "unblocked"
          }`
        );
      }
    },
    deletingVcard(vcard) {
      if (this.user.user_type == "V" && vcard.phone_number == this.user.id) {
        this.$store.dispatch("resetOwnUserDeleted");
        this.$router.push({ name: "Home" });
        this.$toast.show("Your account has been deleted");
      } else {
        this.$toast.show(
          `The Vcard (#${vcard.phone_number} : ${vcard.name}) was deleted`
        );
      }
    },
    newVcard(vcard) {
      this.$toast.show(
        `The Vcard (#${vcard.phone_number} : ${vcard.name})  was registered`
      );
    },
    updateVcard(vcard) {
      if (this.user.user_type == "A") {
        this.$toast.show(
          `The Vcard (#${vcard.phone_number} : ${vcard.name}) was updated`
        );
      } else {
        this.$toast.show(`Your max debit  was updated`);
        this.$store.dispatch("updateDebit", vcard);
      }
    },
    helpGiven(context) {
      const user = context[0];
      const roomName = context[1];
      const isHelpGiven = context[2];
      this.$store.commit("setRoomName", roomName);
      if (this.user.user_type == "V" && isHelpGiven) {
        this.$toast.show(`An admin is assisting you`);
        this.$store.commit("setShowChat", true);
      } else if (this.user.user_type == "V") {
        this.$toast.show(`There are no admins to help you.`);
        this.$store.commit("setShowChat", false);
      } else {
        //toast para o admin
        this.$toast.show(`You will be assisting  ${user.name}`);
        this.$store.commit("setShowChat", true);
      }
    },
    chatMessage(context) {
      const user = context[0];
      const message = context[1];
      if (user.id != this.user.id && !this.showMessage)
        this.$toast.show(`Message Received from ${user.name} : ${message}`);
      this.$store.commit("setMessages", { user: user, message: message });
      setTimeout(() => {
        this.$refs.scrollable.scrollTop = this.$refs.scrollable.scrollHeight;
        this.$refs.scrollableMobile.scrollTop =
          this.$refs.scrollableMobile.scrollHeight;
      }, 100);

      // setTimeout(function() {this.$refs.scrollable.scrollTop = this.$refs.scrollable.scrollHeight - this.$refs.scrollable.clientHeight},100)
    },
    disconnected(user) {
      this.cleanChat();
      if (this.user.id !== user.id)
      {
        this.$toast.show(`The other user has disconnected from the chat`);
      }
      if (this.user.user_type == "A") {
        this.$socket.emit("reconnectAdmin", this.user);
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    lastTransactions() {
      return this.$store.state.lastTransactions;
    },
    userName() {
      return this.$store.state.user ? this.$store.state.user.name : "";
    },
    userPhotoUrl() {
      let urlPhoto = this.$store.state.user ? this.$store.state.user.photo_url : null;
      return urlPhoto ? this.$serverUrl + "/storage/fotos/" + urlPhoto : this.$serverUrl + "/img/avatar-none.png";
    },
    opacity() {
      return this.showMessage ? "1.0" : "0.5";
    },
    showChat() {
      return this.$store.state.showChat;
    },
    messages() {
      return this.$store.state.messages;
    },
    roomName() {
      return this.$store.state.roomName;
    },
    showMessage() {
      return this.$store.state.showMessage;
    },
  },

  mounted() {
    this.$store.dispatch("restoreToken").then((token) => {
      if (token) {
        this.$store.dispatch("refresh");
      }
    });
  },
};
</script>

<style lang="css">
@import "./assets/css/dashboard.css";

.avatar-img {
  margin: -2.2rem 0.8rem -2rem 0.8rem;
  width: 3rem;
  height: 3rem;
}
.avatar-text {
  line-height: 2.2rem;
  margin: 1rem 0.5rem -2rem 0;
  padding-top: 1rem;
}

.dropdown-item {
  font-size: 0.875rem;
  cursor: pointer;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}

.btn.btn-primary.px-5 {
  margin-right: 20px;
}

.col-sm-4.mx-auto.loggedOut {
  margin-top: 50px;
}

@media (max-width: 1048px)
{
  .col-sm-4.mx-auto.loggedOut {
    width: 80% !important;
  }
}

label.text-light.balance {
  margin-top: 13px;
  font-size: 16px;
  font-weight: 500;
  margin-right: 30px;
}

@media (max-width: 400px) {
  label.text-light.balance {
    font-size: 13px;
  }
}

label.text-light.balance.small {
  display: none;
}

@media (max-width: 767.11px) {
  label.text-light.balance.small {
    display: block;
    margin-top: 0;
    font-size: 13px;
    padding: 0 5px 0 5px;
    margin-right: 0;
  }

  .container.border.rounded.text-black.chat.bg-light.border-secondary.computer {
    display: none;
  }

  .container.border.rounded.text-black.chat.bg-light.border-secondary.mobile.d-none {
    display: block !important;
  }

  .chat {
    position: fixed !important;
    max-width: 300px;
  }
}

.chat {
  z-index: 1000;
  position: absolute;
  bottom: 0;
  padding: 0px;
  /*max-width: 300px;*/
  max-height: 400px;
  border-width: 2px !important;
}

.messages {
  max-height: 334px;
  padding-left: 5px;
}

.message {
  /* inline-size: 285px; */
  overflow-wrap: break-word;
  /* max-width: 250px; */
  padding-right: 20px;
}
.overflow-auto {
  overflow-y: overlay !important;
}

.showMessage {
  width: auto;
  text-align: center;
  background-color: var(--bs-body-color);
  max-height: 25px;
  cursor: pointer;
  color: rgb(255 255 255);
}

.ask-help {
  text-align: center;
}

button.btn.btn-light.px-5.help {
  font-weight: 500;
  padding-right: 10px !important;
  padding-left: 0 !important;
}

.chatButton {
  width: 40px !important;
  background-color: red;
  padding-left: 9px;
  cursor: pointer;
}

.chatInput {
  width: auto;
}
</style>
