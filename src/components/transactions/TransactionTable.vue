<template>
  <div style="overflow-x:auto;">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showID">#ID</th>
          <th v-if="showDateTime">Date Time</th>
          <th v-if="showType">Type</th>
          <th v-if="showValue">Value</th>
          <th v-if="showOldValue">Old Balance</th>
          <th v-if="showNewValue">New Balance</th>
          <th v-if="showMoreInfo">More Info</th>
          <th class="text-center" v-if="showMoreInfo">Edit Transaction</th>
        </tr>
      </thead>
      <tbody v-for="transaction in editingTransactions" :key="transaction.id">
        <tr>
          <td v-if="showID">{{ transaction.id }}</td>
          <td v-if="showDateTime">{{ transaction.datetime }}</td>
          <td v-if="showType">{{ transaction.type }}</td>
          <td v-if="showValue">{{ transaction.value }}</td>
          <td v-if="showOldValue">{{ transaction.old_balance }}</td>
          <td v-if="showNewValue">{{ transaction.new_balance }}</td>
          <td>
            <div>
              <button
                class="btn btn-xs btn-light info"
                @click="transactionDetail(transaction)"
                v-if="!transaction.moreTransaction"
              >
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <button
                class="btn btn-xs btn-light info"
                @click="transactionDetail(transaction)"
                v-else
              >
              <i class="bi bi-arrow-bar-up"></i>
                
              </button>
            </div>
          </td>
          <td class="text-center">
              <button
                class="btn btn-xs btn-light"
                @click="editTransaction(transaction)"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>
          </td>
        </tr>
        
          <td colspan="100%" v-if="showMoreInfo">
            <div>
              <transaction-detail
                :transaction="transaction"
                v-if="transaction.moreTransaction"
              ></transaction-detail>
            </div>
          </td>
      </tbody>
    </table>
  </div>
</template>

<script>
import TransactionDetail from "./TransactionDetail";
export default {
  name: "TransactionTable",
  components: {
    TransactionDetail,
  },
  props: {
    transaction: Object,
    transactions: {
      type: Array,
      default: () => [],
    },
    showID: {
      type: Boolean,
      default: true,
    },

    showDateTime: {
      type: Boolean,
      default: true,
    },
    showType: {
      type: Boolean,
      default: true,
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    showOldValue: {
      type: Boolean,
      default: true,
    },
    showNewValue: {
      type: Boolean,
      default: true,
    },
    showMoreInfo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editingTransactions: this.transactions,
      moreInfo: null,
    };
  },
  watch: {
    transactions(newTransactions) {
      this.editingTransactions = newTransactions;
    },
  },
  methods: {
    transactionDetail(transaction) {
      transaction.moreTransaction = !transaction.moreTransaction;
    },
    editTransaction(transaction) {
      this.$emit("editing", transaction);
    },
  },
};
</script>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

button.btn.btn-xs.btn-light.info {
  padding: 1px 1px 1px 8px;
}

.button.bi.bi-three-dots-vertical {
  height: 45px;
}

thead {
  border-bottom: 2px solid currentColor;
}

.table>:not(:first-child) {
  border-top: none;
}
</style>
