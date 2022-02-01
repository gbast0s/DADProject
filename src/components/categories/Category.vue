<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>
  <category-detail
    :operationType="operation"
    :category="category"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></category-detail>
</template>

<script>
import CategoryDetail from "./CategoryDetail.vue";

export default {
  name: "Category",
  components: {
    CategoryDetail,
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
    vcard: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      category: this.newCategory(),
      errors: []  
    };
  },
  computed: {
    operation() {
      return !this.id || this.id < 0 ? "insert" : "update";
    },
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    // beforeRouteUpdate was not fired correctly
    // Used this watcher instead to update the ID
    id: {
      immediate: true,
      handler(newValue) {
        this.loadCategory(newValue);
      },
    },
  },
  methods: {
    dataAsString() {
      return JSON.stringify(this.category);
    },
    newCategory() {
      return {
        name: "",
        type: null,
      };
    },
    loadCategory(id) {
      if (!id || id < 0) {
        this.category = this.newCategory();
        this.originalValueStr = this.dataAsString();
      } else {
        if (this.user && this.user.user_type == "V") {
          this.$axios
            .get("categories/" + id)
            .then((response) => {
              this.category = response.data.data;
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$axios
            .get("defaultcategories/" + id)
            .then((response) => {
              this.category = response.data.data;
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR
            })
            .catch((error) => {
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR
              this.$router.push({ name: "Categories" });
              console.log(error);
            });
        }
      }
    },
    cancel() {
      this.$router.back();
    },
    save() {
      if (this.user && this.user.user_type == "V") {
        if (this.operation == "insert") {
          this.$axios
            .post("category", this.category)
            .then((response) => {
              this.$toast.success(
                "Category #" +
                  response.data.data.name +
                  " was created successfully."
              );
              this.originalValueStr = this.dataAsString();

              this.$router.back();
            })
            .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error(
                  "Category was not created due to validation errors!"
                );
                this.errors = error.response.data.errors;
              } else {
                this.$toast.error(
                  "Category was not created due to unknown server error!"
                );
              }
            });
        } else {
          this.$axios
            .put("categories/" + this.id, this.category)
            .then((response) => {
              this.$toast.success(
                "Category " +
                  response.data.data.name +
                  " was update successfully."
              );
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR

              this.$router.back();
            })
            .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error(
                  "Category was not updated due to validation errors!"
                );
                this.errors = error.response.data.errors;
              } else {
                this.$toast.error(
                  "Category was not updated due to unknown server error!"
                );
              }
            });
        }
      } else {
        if (this.operation == "insert") {
          this.$axios
            .post("defaultcategory", this.category)
            .then((response) => {
              this.$toast.success(
                "Category #" +
                  response.data.data.id +
                  " was created successfully."
              );
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR
              this.$socket.emit("newCategory", response.data.data, this.user);
              this.$router.back();
            })
            .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error(
                  "Category was not created due to validation errors!"
                );
                this.errors = error.response.data.errors;
              } else {
                this.$toast.error(
                  "Category was not created due to unknown server error!"
                );
              }
            });
        } else {
          this.$axios
            .put("defaultcategories/" + this.id, this.category)
            .then((response) => {
              this.$toast.success(
                "Category #" +
                  response.data.data.id +
                  " was update successfully."
              );
              this.originalValueStr = this.dataAsString(); //TODO: COPIAR
              this.$socket.emit("updateCategory", this.category, this.user);
              this.$router.back();
            })
            .catch((error) => {
              if (error.response.status == 422) {
                this.$toast.error(
                  "Category was not updated due to validation errors!"
                );
                this.errors = error.response.data.errors;
              } else {
                this.$toast.error(
                  "Category was not updated due to unknown server error!"
                );
              }
            });
        }
      }
    },
    leaveConfirmed() {
      if (this.nextCallBack) {
        this.nextCallBack();
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.user) {
      this.nextCallBack = null;
      let newValueStr = this.dataAsString();
      if (this.originalValueStr != newValueStr) {
        this.nextCallBack = next;
        let dlg = this.$refs.confirmationDialog;
        dlg.show();
      } else {
        next();
      }
    } else {
      next();
    }
  },
};
</script>
