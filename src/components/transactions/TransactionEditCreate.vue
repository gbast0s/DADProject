<template>
  <div>
    <div class="mb-3">
      <label
        for="inputPhoneNumber"
        class="form-label"
      >Payment Type</label>
        <select
        class="form-select"
        id="selectPaymentType"
        :disabled="operationType=='update'"
        @change="selectedChanged($event)"
        >
        <option
            v-for="pt in paymentTypes"
            :key="pt.code"
            :value="pt.description"
            :selected="editingTransaction.payment_type == pt.code ? true : false"
        >
            {{ pt.name }}
        </option>
        </select>
      <field-error-message
        :errors="errors"
        fieldName="payment_type"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputPaymentReference"
        class="form-label"
      >Payment Reference</label>
      <input
        type="text"
        class="form-control"
        id="inputPaymentReference"
        required
        v-model="editingTransaction.payment_reference"
        :placeholder="selected"
        :disabled="operationType=='update'"
      >
      <field-error-message
        :errors="errors"
        fieldName="payment_reference"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputEmail"
        class="form-label"
      >Value</label>
      <input
        type="number"
        class="form-control"
        id="inputValue"
        required
        v-model="editingTransaction.value"
        :disabled="operationType=='update'"
      >
      <field-error-message
        :errors="errors"
        fieldName="value"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="selectCategory"
        class="form-label"
      >Category</label>
        <select
        class="form-select"
        id="selectCategory"
        @change="selectedChangedCategory($event)"
        >
        <option value="">**No Category**</option>
        <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            :selected="category.id == editingTransaction.category_id ? true : false"
        >
            {{ category.name }}
        </option>
        </select>
      <field-error-message
        :errors="errors"
        fieldName="category_id"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputDescription"
        class="form-label"
      >Description</label>
      <textarea class="form-control" id="inputDescription" rows="4" v-model="editingTransaction.description"></textarea>
      <field-error-message
      :errors="errors"
      fieldName="description"
      ></field-error-message>
    </div>
    <div class='mb-3 d-flex justify-content-end'>
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="update"
      >Save</button>
      <button
        type="button"
        class="btn btn-light px-5"
        @click="cancel"
      >Cancel</button>
    </div>
  </div>
</template>

<script> 

export default {
  name: 'TransactionEditCreate',
  data () {
    return {
      editingTransaction: this.transaction,
      selected: "Bank Transfer - IBAN account code (2 letters and 23 digits)",    
    }
  },
  props: {
    transaction: {
      type: Object,
      required: true
    },
    paymentTypes: {
      type: Object,
      required: true,
    },
    categories: {
      type: Object,
      required: true,
    },
    operationType: {
      type: String,
      default: 'register'  // insert / update
    },
    errors: {
      type: Object,
      default: null
    },
  },
  watch: {
    transaction (newTransaction) {
      this.editingTransaction = newTransaction
    },
  },
  emits: [
    'update',
    'create',
    'cancel',
  ],
  methods: {
    update ()
    {
      if(this.operationType == 'create')
      {
        this.$emit('create')
      }
      else
      {
        this.$emit('update')
      }
    },
    cancel()
    {
      this.$emit('cancel')
    },
    selectedChanged(e) {
      this.selected = e.target.value;
      this.editingTransaction.payment_type = this.paymentTypes.find(
        (ele) => ele.description === e.target.value
      ).code;
    },
    selectedChangedCategory(e) {
      this.editingTransaction.category_id = e.target.value;
    },
  },
}
</script>

<style scoped>


</style>