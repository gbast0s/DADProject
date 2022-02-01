<template>
  <input-dialog 
    ref="inputDialog"
    confirmationBtn="Update Confirmation Code"
    msg="Insert your current Password to update your info!"
    :error="error"
    @inputDialog="update">

   </input-dialog> 
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="update"
  >
    <h3 class="mt-5 mb-3">Change Confirmation Code</h3>
    <hr>
    <div class="mb-3">
      <label
        for="inputCode"
        class="form-label"
      >New Code</label>
      <input
        type="password"
        class="form-control"
        id="inputCode"
        required
        v-model="codes.code"
      >
      <field-error-message
      :errors="errors"
      fieldName="code"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputCodeConfirm"
        class="form-label"
      >Code Confirmmation</label>
      <input
        type="password"
        class="form-control"
        id="inputCodeConfirm"
        required
        v-model="codes.code_confirm"
      >
      <field-error-message
        :errors="errors"
        fieldName="code_confirm"
      ></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="passwordConfirmation"
      >Change Confirmation Code</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ChangeConfirmationCode',
  data () {
    return {
      codes: {
        code: '',
        code_confirm: ''
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
    passwordConfirmation () {
      // FALTA FAZER O LOGIN 
      let dlg = this.$refs.inputDialog
      dlg.show()
    },
    update(currentPassword)
    {

      this.codes.currentPassword = currentPassword

      this.$axios.patch('vcards/'+ this.userid +'/code', this.codes)
        .then(() => { //TODO: Porque o response não vem com o numero de telefone
          this.$toast.success('Vcard #' + this.userid + ' confirmation code was updated successfully.')
          this.$router.back()
        })
        .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error('Vcard #' + this.userid + ' confirmation code was not updated due to validation errors!')
              this.errors = error.response.data.errors
              this.error = error.response.data.errors.currentPassword ? error.response.data.errors.currentPassword[0] : null
            } 
            else if(error.response.status == 401)
            {
              this.error = error.response.data.currentPassword
              this.$toast.error(this.error)
            }
            else {
              this.$toast.error('Vcard #' + this.userid + ' confirmation code was not updated due to unknown server error!')
            }
      })
    }
  }
}
</script>

<style scoped>
</style>
