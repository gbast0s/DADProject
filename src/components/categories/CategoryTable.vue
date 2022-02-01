<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Delete Category"
    :msg="`Do you really want to delete the category ${categoryToDeleteMessage}?`"
    @confirmed="deleteConfirmed"
  >
  </confirmation-dialog>
  <div style="overflow-x:auto;">
    <table class="table">
      <thead>
        <tr>
          <th class="align-left" v-if="user ? user.user_type == 'A' : false">
            #
          </th>
          <th class="align-middle">Name</th>
          <th class="align-middle">Type</th>
          <th class="align-middle categories title">Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td class="align-middle" v-if="user ? user.user_type == 'A' : false">
            {{ category.id }}
          </td>

          <td class="align-middle">{{ category.name }}</td>
          <td class="align-middle">{{ category.type }}</td>
          <td class="text-end align-middle" v-if="showEditButton">
            <div class="d-flex categories">
              <button
                class="btn btn-xs btn-light"
                @click="editCategory(category)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>

              <button
                class="btn btn-xs btn-light"
                @click="deleteCategory(category)"
                v-if="showDeleteButton"
              >
                <i class="bi bi-xs bi-x-square-fill"></i>
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
  name: "CategoryTable",
  props: {
    category: Object,
    categories: {
      type: Array,
      default: () => [],
    },
    showId: {
      type: Boolean,
      default: true,
    },
    showAdmin: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      categoryToDelete: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    categoryToDeleteMessage() {
      if (this.user && this.user.user_type == "A") {
        return this.categoryToDelete
          ? `#${this.categoryToDelete.id} - ${this.categoryToDelete.name}`
          : "";
      } else {
        return this.categoryToDelete ? `${this.categoryToDelete.name}` : "";
      }
    },
    },
    emits: ["edit", "delete"],
    methods: {
      editCategory(category) {
        this.$emit("edit", category);
      },
      deleteCategory(category) {
        this.categoryToDelete = category;
        let dlg = this.$refs.confirmationDialog;
        dlg.show();
      },
      deleteConfirmed() {
        if (this.user.user_type == "A") {
          this.$axios.delete("defaultcategories/" + this.categoryToDelete.id)
            .then((response) => {
                this.$emit("delete", response.data.data);
                this.$socket.emit("deletingCategory", this.categoryToDelete, this.user);
            }).catch(() => {
            this.$toast.error("Category was not deleted due to unknown server error!");
          });
        } else {
          this.$axios.delete("categories/" + this.categoryToDelete.id)
            .then((response) => {
                this.$emit("delete", response.data.data)
            }).catch(() => {
              this.$toast.error("Category was not deleted due to unknown server error!");
            });
        }
      },
    }
  
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
.categories {
  justify-content: flex-end;

  text-align: right;

  /*padding-right: 9%;*/
}
.categories.title {
  padding-right: 4%;
}
</style>
