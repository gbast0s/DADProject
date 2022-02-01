<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Delete admin"
    :msg="`Do you really want to delete the admin ${ adminToDeleteMessage }?`"
    @confirmed="deleteConfirmed"
  >
  </confirmation-dialog>
  <div style="overflow-x:auto;">
    <table class="table">
      <thead>
          <th v-if="showId" class="align-middle">#</th>
          <th class="align-middle">Name</th>
          <th v-if="showEmail" class="align-middle">Email</th>
          <th v-if="showEditButton" class="buttons">Edit</th>
          <th v-if="showDeleteButton" class="buttons">Delete</th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td v-if="showId" class="align-middle">{{ user.id }}</td>

          <td class="align-middle">{{ user.name }}</td>
          <td v-if="showEmail" class="align-middle">{{ user.email }}</td>
          <td class="align-middle">
              <div class="buttons" v-if="user.id == loggedUser.id">
                <button
                  class="btn btn-xs btn-light"
                  @click="editAdmin(user)"
                  v-if="showEditButton"
                ><i class="bi bi-xs bi-pencil"></i>
                </button>
              </div>
          </td>
          <td class="align-middle" v-if="showDeleteButton">
            <div class="buttons">
              <button
                class="btn btn-xs btn-light"
                @click="deleteAdmin(user)"
                v-if="showDeleteButton"
              ><i class="bi bi-xs bi-x-square-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AdminTable",
  data () {
    return {
      adminToDelete: null
    }
  },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    showId: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: true,
    },
    showEditButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["edit", "deleting"],
  computed: { 
    adminToDeleteMessage () {
      return this.adminToDelete
        ? `#${this.adminToDelete.id} - ${this.adminToDelete.name}`
        : ''
    },
    loggedUser(){
      return this.$store.state.user;
    }
  },
  methods: {

    editAdmin(user) {
      this.$emit("edit", user);
    },
    deleteConfirmed ()
    {
        this.$axios.delete('admins/' + this.adminToDelete.id)
        .then((response) => {
          this.$emit('deleting', response.data.data)
          this.$socket.emit("deletingAdmin", this.adminToDelete, this.loggedUser);
          if(this.adminToDelete.id == this.$store.state.user.id)
          {
            this.$store.dispatch("resetOwnUserDeleted");
            this.$router.push({ name: 'Home' })
          }
        })
        .catch((error) => {
          this.$toast.error(error.response.data)
        })
    },
    deleteAdmin (user) {
      this.adminToDelete = user
      let dlg = this.$refs.confirmationDialog
      dlg.show()
    },
  },
};
</script>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.button.btn.btn-xs.btn-light {
  height: 45px;
}

.buttons {
  text-align: center;
}

</style>
