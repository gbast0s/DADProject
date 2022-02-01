<template>
  <input-dialog 
    ref="inputDialog"
    confirmationBtn="Update Password"
    msg="Insert your current Password to update your info!"
    :error="error"
    @inputDialog="update">

   </input-dialog> 
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="update"
  >
    <h3 class="mt-5 mb-3">Change Password</h3>
    <hr>
    <div class="mb-3">
      <label
        for="inputPassword"
        class="form-label"
      >New Password</label>
      <input
        type="password"
        class="form-control"
        id="inputPassword"
        required
        v-model="passwords.password"
      >
      <field-error-message
      :errors="errors"
      fieldName="password"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputPasswordConfirm"
        class="form-label"
      >Password Confirmation</label>
      <input
        type="password"
        class="form-control"
        id="inputPasswordConfirm"
        required
        v-model="passwords.password_confirm"
      >
      <field-error-message
        :errors="errors"
        fieldName="password_confirm"
      ></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="changePassword"
      >Change Password</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ChangePassword',
  data () {
    return {
      passwords: {
        password: '',
        password_confirm: ''
      },
      errors: [],
      error: null
    }
  },
  computed:{
    user() {
      return this.$store.state.user;
    },
  },
  props: {
    userid: {
      type: Number,
      default: null
    },
  },
  methods: {
    changePassword () {
      // FALTA FAZER O LOGIN 
      let dlg = this.$refs.inputDialog
      dlg.show()
    },
    update(currentPassword)
    {
      if(this.user.user_type == 'A')
      {
        this.passwords.currentPassword = currentPassword

        this.$axios.patch('admins/'+ this.userid +'/password', this.passwords)
          .then(() => { //TODO: Porque o response não vem com o numero de telefone
            this.$toast.success('Password for user #' + this.userid + ' was updated successfully.')
            this.$router.back()
          })
          .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error('The Password was not updated due to validation errors!')
                this.errors = error.response.data.errors
                this.error = error.response.data.errors.currentPassword ? error.response.data.errors.currentPassword[0] : null
              } 
              else if(error.response.status == 401)
              {
                this.error = error.response.data.currentPassword
                this.$toast.error(this.error)
              }
              else {
                this.$toast.error('The Password was not updated due to unknown server error!')
              }
        })
      }
      else if (this.user.user_type == 'V')
      {
        this.passwords.currentPassword = currentPassword

        this.$axios.patch('vcards/'+ this.userid +'/password', this.passwords)
          .then(() => { //TODO: Porque o response não vem com o numero de telefone
            this.$toast.success('Password for user #' + this.userid + ' was updated successfully.')
            this.$router.back()
          })
          .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error('The Password was not updated due to validation errors!')
                this.errors = error.response.data.errors
                this.error = error.response.data.errors.currentPassword ? error.response.data.errors.currentPassword[0] : null
              } 
              else if(error.response.status == 401)
              {
                this.error = error.response.data.currentPassword
                this.$toast.error(this.error)
              }
              else {
                this.$toast.error('The Password was not updated due to unknown server error!')
              }
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
