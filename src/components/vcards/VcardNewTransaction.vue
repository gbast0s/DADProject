<template>
  <div class="border-bottom">
    <div class="form-inline d-flex adminTransaction">
      <div class="form-group d-col-grow d-flex">
        <div class="d-col-grow">
          <h6 class="titulo-addCredit">Add Credit to Vcard:</h6>
        </div>
      </div>
      <div class="form-group d-col-grow d-flex inputsTransaction">
        <div class="d-col-grow">
          <label for="amm">Ammount:</label>
          <input
            id="amm"
            v-model="transaction.value"
            type="number"
            min="0"
            ref="amm"
            class="form-control expand"
            placeholder="Ammount"
            size="40"
          />
        </div>
      </div>
      <div class="form-group d-col-grow d-flex inputsTransaction">
        <div class="d-col-grow">
          <label for="selectPaymentType" class="form-label"
            >Payment Type:</label
          >
          <select
            @change="selectedChanged($event)"
            class="form-select"
            id="selectPaymentType"
          >
            <option
              v-for="pt in paymentTypes"
              :key="pt.code"
              :value="pt.description"
            >
              {{ pt.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group d-col-grow d-flex inputsTransaction">
        <div class="d-col-grow">
          <label for="pr">Payment Reference</label>
          <input
            id="pr"
            ref="pr"
            v-model="transaction.payment_reference"
            type="text"
            class="form-control expand"
            :placeholder="selected"
            size="40"
          />
        </div>
      </div>
      <div class="mx-2 mt-2">
        <button
          @click="create"
          type="button"
          class="btn btn-primary px-4 btn-CreateTransaction"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VcardNewTransaction",

  emits: ["save"],
  data() {
    return {
      transaction: {
        payment_reference: "",
        payment_type: "IBAN",
        type: "C",
        value: null,
        description: "Credit Transaction by Administrator",
        category_id: null,
      },
      //editTask: this.task
      // the editing task in this component is a clone of the
      // task passed on the prop
      editTask: Object.assign({}, this.task),
      errors: null,
      selected: "Bank Transfer - IBAN account code (2 letters and 23 digits)",
    };
  },
  computed: {
    paymentTypes() {
      return this.$store.state.paymentTypes;
    },
  },
  methods: {
    selectedChanged(e) {
      this.selected = e.target.value;
      this.transaction.payment_type = this.paymentTypes.find(
        (ele) => ele.description === e.target.value
      ).code;
    },
    create() {
      if (this.transaction.value <= 0 || this.transaction == null) {
        this.$toast.error("Transaction ammount should be above 0€");
        this.$refs.amm.focus();
        return;
      } else if (this.transaction.payment_reference == "") {
        this.$toast.error("Please provide a payment reference");
        this.$refs.pr.focus();
        return;
      }
      this.$emit("save", this.transaction);
    },
  },
};
</script>

<style scoped>
input,
select {
  margin: 5px 20px 5px 10px;
}
input[type="checkbox"] {
  margin: 15px 20px 5px 10px;
}
select {
  margin: 5px 20px 5px 10px;
}
button {
  margin: 5px 5px 5px 10px;
}
label {
  margin: 10px 0px auto 10px;
}

.btn-CreateTransaction {
  margin-top: 1.75rem;
}

.inputsTransaction {
  margin-right: 15px;
}

.form-inline.d-flex.adminTransaction {
  justify-content: center;
  align-items: center;
}

.titulo-addCredit {
  margin-top: 2.1rem;
}
</style>
