<template>
    <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Administrators</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalUsers }}</h5>
    </div>
  </div>
  <hr />
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <form @submit.prevent="loadAdmins(1,field)" class="mx-2 mt-2 flex-grow-1 filter-div">
      <div >
        <label class="form-label" for="keyWord"
          >Keyword to Filter:
        </label>
        <input
          class="form-control"
          id="keyWord"
          v-model="field"
          placeholder="Id, Name, Email (Press Enter to filter)"
          type="text"
        />
      </div>
    </form>
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addAdmin"
        @click="addAdmin"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Admin</button>
    </div>
  </div>
  <admin-table :users="users" :showId="true" @edit="editUser" @deleting="deleteAdmin"></admin-table>
  <pagination :meta="meta" @pagination="loadAdmins($event, field)"></pagination>
</template>

<script>
import AdminTable from "./AdminTable.vue";

export default {
  name: "Admins",
  components: {
    AdminTable,
  },
  data() {
    return {
      users: [],
      // filterByKeyWord: "",
      totalUser: null,
      meta: [],
      field: null
    };
  },
  watch: {
    field: {
      immediate: true,
      handler (newValue) {
        if(newValue === "")
        {
          this.loadAdmins()
          this.field = null
        }
      }
    },
  },
  computed: {
    // filterByKeyWordL(){
    //   return this.filterByKeyWord.toLowerCase()
    // },
    // filteredUsers () {
    //   return this.users.filter(t =>
    //       (
    //         t.name.toLowerCase().includes(this.filterByKeyWordL) 
    //         || t.id.toString().includes(this.filterByKeyWordL) 
            
    //      ))
    // },
    totalUsers () {
      return this.meta.total
    },
  },
  methods: {
    loadAdmins(page, field) {
      this.$axios.get("admins", {
        params: {
          page,
          field
        }
      }).then((response) => {
          this.users = response.data.data;
          this.meta = response.data.meta
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editUser(user) {
      this.$router.push({ name: "EditingAdmin", params: { id: user.id } });
    },
    deleteAdmin (deletedAdmin, flag)
    {
      let idx = this.users.findIndex((t) => t.id === deletedAdmin.id)
      if (idx >= 0) {
        this.users.splice(idx, 1)
        if(flag == null)
        {
          this.$toast.success("Admin #" + deletedAdmin.id + " - " + deletedAdmin.name + " deleted successfully")
        }
        this.meta.total = this.meta.total - 1
      }
    },
    addAdmin()
    {
      this.$router.push({ name: "Admin"});
    }
  },
  sockets: {
    newAdmin(admin) {
      this.users.push(admin);
      this.meta.total = this.meta.total + 1
    },
    updateAdmin(admin) {
      let idx = this.users.findIndex(
        (t) => t.id === admin.id
      );  
      if(idx >= 0)
      {
        this.users[idx] = admin
      }
    },
    deletingAdmin(admin) {
      this.deleteAdmin(admin, true);
    },
  },
  mounted() {
    this.loadAdmins();
  },
};
</script>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}

.btn-addAdmin {
  margin-top: 1.75rem;
}

</style>
