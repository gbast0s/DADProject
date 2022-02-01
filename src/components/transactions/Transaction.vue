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
    confirmationBtn="Confirm Transaction"
    msgCode="Insert your Confirmation Code to make the transaction!"
    :operation="'transaction'"
    :errorCode="errorCode"
    @inputDialog="updateCreateTransaction"
  >
  </input-dialog>
  <form class="row g-3 needs-validation" novalidate>
    <h3 class="mt-5 mb-3">{{ title }}</h3>
    <hr />
    <transaction-edit-create
      :transaction="transaction"
      :errors="errors"
      :paymentTypes="paymentTypes"
      :categories="filteredCategories"
      :operationType="operation"
      @create="create"
      @update="updateCreateTransaction"
      @cancel="cancel"
    ></transaction-edit-create>
  </form>
</template>

//TODO: POR FAZER PARA SE PODER EDITAR A CATEGORIA E DESCRIÇÃO //TODO:APROVEITAR E FAZER O CRIAR COM O EDITAR PARA APROVEITAR COMPONENTE

<script>
import TransactionEditCreate from "./TransactionEditCreate.vue";

export default {
  name: "Transaction",
  components: {
    TransactionEditCreate,
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
    transactionVcard: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      transaction: this.newTransaction(),
      categories: [],
      errors: [],
      errorCode: null,
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(newValue) {
        this.loadTransaction(newValue);
      },
    },
  },
  computed: {
    operation() {
      return !this.id || this.id < 0 ? "create" : "update";
    },
    title() {
      return !this.id || this.id < 0
        ? "New Transaction"
        : "Editing Transaction #" + this.id;
    },
    user() {
      return this.$store.state.user;
    },
    paymentTypes() {
      return this.$store.state.paymentTypes;
    },
    filteredCategories(){
      return this.categories.filter(t =>(
        (this.transaction.type == t.type)

      )) 
    }
  },
  methods: {
    dataAsString() {
      return JSON.stringify(this.transaction);
    },
    newTransaction() {
      return {
        payment_reference: null,
        payment_type: "IBAN",
        type: "D",
        value: null,
        description: "",
        category_id: null,
      };
    },
    loadTransaction(id) {
      if (!id || id < 0) {
        this.transaction = this.newTransaction();
        this.originalValueStr = this.dataAsString();
      } else {
        this.$axios
          .get("transactions/" + id)
          .then((response) => {
            this.transaction = response.data.data;
            this.originalValueStr = this.dataAsString();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    loadCategories() {
      this.$axios
        .get("vcards/" + this.user.id + "/categories", {
          params: {
            paginated: "N",
          },
        })
        .then((response) => {
          this.categories = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    create() {
      let dlg = this.$refs.inputDialog;
      dlg.show();
    },
    updateCreateTransaction(code) {
      this.transaction.code = code;

      if (this.operation == "create") {
        this.$axios
          .post("vcards/" + this.user.id + "/transactions", this.transaction)
          .then(() => {
            this.$toast.success("Transaction created successfully.");
            this.originalValueStr = this.dataAsString();
            if(this.transaction.payment_type=="VCARD")
            {
              this.$socket.emit("newTransaction", this.transaction, this.user);
            }
            this.$store.dispatch("loadUser");
            this.$router.back();
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error(
                "Transaction was not created due to validation errors!"
              );
              this.errors = error.response.data.errors;
              this.errorCode = error.response.data.errors.code
                ? error.response.data.errors.code[0]
                : null;
            } else if (error.response.status == 403) {
              if (error.response.data.code) {
                this.errorCode = error.response.data.code;
                this.$toast.error(this.errorCode);
              } else {
                this.$toast.error(error.response.data.error);
              }
            } else {
              this.$toast.error(
                "Transaction was not created due to unknown server error!"
              );
            }
          });
      } else if (this.operation == "update") {
        this.$axios
          .put("transactions/" + this.transaction.id, this.transaction)
          .then(() => {
            this.$toast.success("Transaction updated successfully.");
            this.originalValueStr = this.dataAsString();
            this.$router.back();
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.$toast.error(
                "Transaction was not updated due to validation errors!"
              );
              this.errors = error.response.data.errors;
              this.errorCode = error.response.data.errors.code
                ? error.response.data.errors.code[0]
                : null;
            } else if (error.response.status == 403) {
              if (error.response.data.code) {
                this.errorCode = error.response.data.code;
                this.$toast.error(this.errorCode);
              } else {
                this.$toast.error(error.response.data.error);
              }
            } else {
              this.$toast.error(
                "Transaction was not updated due to unknown server error!"
              );
            }
          });
      }
    },
    cancel() {
      // Replace this code to navigate back
      // this.loadUser(this.id)
      this.$router.back();
    },
    leaveConfirmed() {
      if (this.nextCallBack) {
        this.nextCallBack();
      }
    },
  },
  mounted() {
    this.loadCategories();
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
