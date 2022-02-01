<template>
  <div>
    <p v-if="transaction ? transaction.payment_type : false">
      <b>Payment type:</b> {{ transaction.payment_type }} 
    </p>
    <p v-if="transaction ? transaction.payment_reference : false">
      <b>Payment Reference:</b> {{ transaction.payment_reference }}
    </p>
    <p v-if="transaction ? transaction.pair_transaction : false">
      <b>Pair Transaction:</b> {{ transaction.pair_transaction }}
    </p>
    <p v-if="transaction ? transaction.pair_vcard : false">
      <b>Pair Vcard:</b> {{ transaction.pair_vcard  }}
    </p>
    <p v-if="transaction ? transaction.category_name : false">
      <b>Category Name:</b> {{ transaction.category_name }}
    </p>
    <p v-if="transaction ? transaction.description : false">
      <b>Description:</b> {{ transaction.description }}
    </p>
  </div>
  <hr>
</template>

<script>
export default {
  name: "TransactionDetail",
  props: {
    transaction: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped>
input[type="checkbox"] {
  margin-left: 10px;
  margin-right: 20px;
}
</style>
