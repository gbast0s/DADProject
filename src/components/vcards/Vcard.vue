<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>
  <input-dialog 
    ref="inputDialog"
    confirmationBtn="Update Password"
    msg="Insert your current Password to delete your account!"
    msgCode="Insert your Confirmation Code to delete your account!"
    :operation="'destroy'"
    :error="error"
    :errorCode="errorCode"
    @inputDialog="deleteVcard">

  </input-dialog> 
  <div :class="operation == 'register' ? 'col-sm-4 mx-auto loggedOut' : ''">
    <form class="row g-3 needs-validation" novalidate>
      <h3 :class="user ? 'mt-5 mb-3' : 'mt-5 mb-3 titulo'">{{title}}</h3>
      <hr>
      <vcard-detail :vcard="vcard" :errors="errors" @updateRegist="updateRegist" @cancel="cancel" @detroy="destroy" :operationType="operation"></vcard-detail>
    </form>
  </div>
</template>

<script>
import VcardDetail from "../vcards/VcardDetail.vue"
 

export default {
  name: 'Vcard',
  data () {
    return {
      vcard: this.newVcard(),
      errors: [],
      error: null,
      errorCode: null
    }
  },
  components: {
    VcardDetail,
  },
  props: {
    phone_number: {
      type: Number,
      default: null
    },
  },
  watch: {
    // beforeRouteUpdate was not fired correctly
    // Used this watcher instead to update the ID
    phone_number: {
      immediate: true,
      handler (newValue) {
        this.loadVcard(newValue)
      }
    },
  },
  computed: {
    operation () {
      if(this.user)
      {
        if(this.user.user_type == "A")
        {
          return 'update_debit'
        }
        else
        {
          return 'update'
        }
      }
      else
      {
        return 'register'
      }
    },
    title ()
    {
      return (!this.phone_number || this.phone_number < 0) ? "Register a Vcard" : 'Editing Vcard: #' + this.phone_number
    },
    user() {
      return this.$store.state.user;
    },
  },
   methods: {
        dataAsString () {
          return JSON.stringify(this.vcard)
        },
        newVcard () {
            return {
                phone_number: "",
                name: "",
                email: "",
                photo_url: null,
                password: "",
                confirmation_code: ""
            }
        },
        updateRegist(){
          if(this.operation == "register")
          {
            let data = new FormData()

            for (let [key, value] of Object.entries(this.vcard)) {
                data.append(key, value)
            }

            this.$axios.post('vcard', data)
                .then(() => { 
                  this.$toast.success('Vcard # ' + this.vcard.phone_number + ' was created successfully.')
                  this.originalValueStr = this.dataAsString() //TODO: COPIAR
                  this.$socket.emit("newVcard", this.vcard)
                  this.$router.push({ name: 'Login' })
                })
                .catch((error) => {
                    if (error.response.status == 422) {
                      this.$toast.error('Vcard was not created due to validation errors!')
                      this.errors = error.response.data.errors
                    } else {
                      this.$toast.error('Vcard was not created due to unknown server error!')
                    }
                })
          }
          else if(this.operation == "update_debit")
          {
            this.$axios.patch('vcards/'+ this.phone_number +'/maxdebit', {'max_debit': this.vcard.max_debit})
                .then(() => { 
                  this.$toast.success('Max debit for Vcard #' + this.vcard.phone_number + ' was updated successfully.')
                  this.originalValueStr = this.dataAsString() //TODO: COPIAR
                  this.$socket.emit("updateVcard", this.vcard, this.user)
                  this.$router.back()
                })
                .catch((error) => {
                    if (error.response.status == 422) {
                      this.$toast.error('The Vcard Max Debit was not updated due to validation errors!')
                      this.errors = error.response.data.errors
                    } else {
                      this.$toast.error('The Vcard Max Debit was not updated due to unknown server error!')
                    }
                })
          }
          else if(this.operation == "update")
          {
            let data = new FormData()

            data.append('name', this.vcard.name)
            data.append('email', this.vcard.email)
            data.append('photo_url', this.vcard.photo_url)
            data.append('_method', 'PUT')

            this.$axios.post('vcards/'+ this.phone_number, data)
                .then(() => { 
                  this.$toast.success('Vcard #' + this.vcard.phone_number + ' was updated successfully.')
                  this.originalValueStr = this.dataAsString() //TODO: COPIAR
                  this.$store.dispatch("refresh");
                  this.$socket.emit("updateVcard", this.vcard, this.user)
                  this.$router.push({ name: 'Home' })
                })
                .catch((error) => {
                    if (error.response.status == 422) {
                      this.$toast.error('The Vcard was not updated due to validation errors!')
                      this.errors = error.response.data.errors
                    } else {
                      this.$toast.error('The Vcard was not updated due to unknown server error!')
                    }
                })
          }
        },
        destroy () {
          let dlg = this.$refs.inputDialog
          dlg.show()
        },
        deleteVcard(inputs)
        {
          this.$axios.delete('vcards/' + this.vcard.phone_number, {
            data: {
              password: inputs.password,
              code: inputs.code
            }
          })
          .then(() => {
            this.$socket.emit("deletingVcard", this.vcard, this.user);
            this.$toast.success("Your account has been deleted successfully")
            this.$store.dispatch("resetOwnUserDeleted");
            this.$router.push({ name: 'Home' })
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error('Your account was not deleted due to validation errors on Password or Code!')
              this.error = error.response.data.errors.password ? error.response.data.errors.password[0] : null
              this.errorCode = error.response.data.errors.code ? error.response.data.errors.code[0] : null
            } 
            else if(error.response.status == 401)
            {
              this.error = error.response.data.currentPassword
              this.errorCode = error.response.data.code

              if(error.response.data.currentPassword)
              {
                this.$toast.error(error.response.data.currentPassword)
              }
              else if(error.response.data.code)
              {
                this.$toast.error(error.response.data.code)
              }
            }
            else if(error.response.status == 403)
            {
              this.$toast.error('Your account was not deleted because your balance isn\'t 0!');
            }
            else {
              this.$toast.error('Your account was not deleted due to unknown server error!')
            }
          })
        },
        cancel()
        {                
          this.$router.back()
        },
        loadVcard (phone_number) {
          if (!phone_number || (phone_number < 0)) {

            this.vcard = this.newVcard()
            this.originalValueStr = this.dataAsString()
          } else {
            this.$axios.get('vcards/' + phone_number)
              .then((response) => {
                this.vcard = response.data.data
                this.originalValueStr = this.dataAsString()
              }).catch((error) => {
                if(this.user.user_type == "A")
                {
                  this.originalValueStr = this.dataAsString()
                  this.$router.push({ name: "Vcards" });
                }
                console.log(error)
              })
          }
        },
        leaveConfirmed () {
          if (this.nextCallBack) {
            this.nextCallBack()
          }
        }
    },
    beforeRouteLeave (to, from, next) {
      if(this.user)
      {
        this.nextCallBack = null
        let newValueStr = this.dataAsString()
        if (this.originalValueStr != newValueStr) {
          this.nextCallBack = next
          let dlg = this.$refs.confirmationDialog
          dlg.show()
        } else {
          next()
        }
      }
      else
      {
        next()
      }
  }
}
</script>

<style scoped>
.mt-5.mb-3.titulo{
  text-align: center;
}
</style>
