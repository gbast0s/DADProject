<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>
  <admin-detail
    :user="user"
    :errors="errors"
    :operationType="operation" 
    @save="save"
    @cancel="cancel"
  ></admin-detail>
</template>

<script>
import AdminDetail from "./AdminDetail.vue"

export default {
  name: 'Admin',
  components: {
    AdminDetail
  },
  props: {
    id: {
      type: Number,
      default: null
    },
  },
  data () {
    return {
      user: this.newUser(),
      errors: []  
    }
  },
  watch: {
    // beforeRouteUpdate was not fired correctly
    // Used this watcher instead to update the ID
    id: {
      immediate: true,
      handler (newValue) {
        this.loadUser(newValue)
      }
    },
  },
  computed: {
    operation () {
      return (!this.id || this.id < 0) ? 'create' : 'update'
    },
    loggedUser(){
      return this.$store.state.user;
    }
  },
  methods: {
    dataAsString () {
      return JSON.stringify(this.user)
    },
    newUser () {
      return {
        name: "",
        email: "",
        password: "",
      }
    },
    loadUser (id) {
      if (!id || (id < 0)) {
        this.user = this.newUser()
        this.originalValueStr = this.dataAsString() //TODO: COPIAR
      } else {
        this.$axios.get('admins/' + id)
          .then((response) => {
            this.user = response.data.data
            this.originalValueStr = this.dataAsString() //TODO: COPIAR
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    save () {
      if(this.operation == "create")
      {
        this.$axios.post('admin', this.user)
          .then((response) => {
            this.$toast.success('Admin created successfully.')
            this.originalValueStr = this.dataAsString()
            this.$socket.emit("newAdmin", response.data.data, this.loggedUser);
            this.$router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error('Admin was not created due to validation errors!')
              this.errors = error.response.data.errors
            } else {
              this.$toast.error('Admin was not created due to unknown server error!')
            }
          })
      }
      else if(this.operation == "update")
      {
        this.$axios.put('admins/' + this.id, this.user)
          .then((response) => {
            this.$toast.success('Admin #' + response.data.data.id + ' was updated successfully.')
            this.originalValueStr = this.dataAsString()
            this.$store.dispatch("refresh");
            this.$socket.emit("updateAdmin", this.user, this.loggedUser);
            this.$router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error('Admin #' + this.id + ' was not updated due to validation errors!')
              this.errors = error.response.data.errors
            } else {
              this.$toast.error('Admin #' + this.id + ' was not updated due to unknown server error!')
            }
          })
      }

    },
    cancel () {
      // Replace this code to navigate back
      // this.loadUser(this.id)
      this.$router.back()
    },
    leaveConfirmed () {
      if (this.nextCallBack) {
        this.nextCallBack()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(this.loggedUser)
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
