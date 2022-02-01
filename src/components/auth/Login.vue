<template>
  <div class="col-sm-4 mx-auto loggedOut">
    <form class="row g-3 needs-validation" novalidate @submit.prevent="login">
      <h3 class="mt-5 mb-3 titulo">Login</h3>
      <hr />
      <div class="mb-3">
        <div class="mb-3">
          <label for="inputUsername" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="inputUsername"
            required
            v-model="credentials.username"
          />
        </div>
      </div>
      <div class="mb-3">
        <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            required
            v-model="credentials.password"
          />
        </div>
      </div>
      <div class="buttons">
        <div class="mb-3 d-flex justify-content-center">
          <button type="submit" class="btn btn-dark px-5">Login</button>
        </div>
        <div class="mb-3 d-flex justify-content-center">
          <button type="button" class="btn btn-primary px-5" @click="register">Register</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },
    }
  },
  emits: ["login"],
  methods: {
    login() {
      this.$axios.post("login", this.credentials)
        .then((response) => {
          this.$toast.success(
            "User " +
              this.credentials.username +
              " has entered the application.",
          )
          this.$axios.defaults.headers.common.Authorization =
            "Bearer " + response.data.access_token
          this.$store.dispatch("loadUser").then(() => {
            sessionStorage.setItem("Auth_key", "Bearer " + response.data.access_token)
            //TODO: COMO FAZER PARA QUE ISTO ESPERE PELO USER LOGADO PARA RETORNAR PARA A DASHBOARD E NÃO PARA O QUE ESTÁ
            //TODO: NAS PROTEÇÕES DE ROTAS
            this.$router.push({ name: "Dashboard" })
          })
        })
        .catch((error) => {
          delete this.$axios.defaults.headers.common.Authorization
          this.$store.commit("resetUser")
          this.credentials.password = ""
          let errorMsg = error.response.status == "401" ? error.response.data.msg : error.response.status == "500" ? "User crendetials are Invalid" : "Unknown Error" 
          this.$toast.error(errorMsg)
        })
    },
    register()
    {
      this.$router.push({name: "Register"});
    }
  },
}
</script>

<style scoped>
.mt-5.mb-3.titulo {
  text-align: center;
}

.btn.btn-dark.px-5{
  margin-right: 20px;
}

.btn.btn-primary.px-5
{
  margin-right: 0 !important;
}

.buttons {
    display: flex;
    justify-content: center;
}

@media (max-width: 648px) {
  .buttons{
    flex-direction: column;
  }

  .btn.btn-dark.px-5{
    margin-right: 0px;
  }
}
</style>
