<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ title }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalTransactions }}</h5>
    </div>
  </div>
  <hr />
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectCompleted" class="form-label mx-2 mt-2"
        >Filter by Type:</label
      >
      <select
        class="form-select"
        id="selectType"
        v-model="filterByType"
        @change="
          loadTransactions(1, filterByType, filterByDate, filteredByCategory)
        "
      >
        <option :value="null">All</option>
        <option value="C">Credit (C)</option>
        <option value="D">Debit (D)</option>
      </select>
      <div>
        <label class="form-label mx-2 mt-2" for="dataTime"
          >Date of Transaction</label
        >
        <input
          type="date"
          class="form-control"
          id="dataTime"
          v-model="filterByDate"
          placeholder="Date"
          @change="
            loadTransactions(1, filterByType, filterByDate, filteredByCategory)
          "
        />
      </div>
      <div>
        <label for="selectCategory" class="form-label">Category</label>
        <select
          class="form-select"
          id="selectCategory"
          v-model="filteredByCategory"
          @change="
            loadTransactions(1, filterByType, filterByDate, filteredByCategory)
          "
        >
          <option :value="null">All</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="mx-2 mt-2 d-flex align-items-center">
      <button
        type="button"
        class="btn btn-success px-4 btn-addTransaction"
        @click="addTransaction"
      >
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Create transaction
      </button>
    </div>
  </div>
  <transaction-table
    :transactions="transactions"
    :showPhoneNumber="true"
    @editing="edit"
    :showOwner="true"
  ></transaction-table>
  <pagination
    :meta="meta"
    @pagination="loadTransactions($event, filterByType, filterByDate, filteredByCategory)"
  ></pagination>
</template>

<script>
import TransactionTable from "./TransactionTable.vue";

export default {
  name: "Transactions",
  components: {
    TransactionTable,
  },

  data() {
    return {
      transactions: [],
      categories: [],
      meta: [],
      filterByType: null,
      filterByDate: null,
      filteredByCategory: null,
    };
  },
  sockets: {
    newTransaction() {
        this.loadTransactions()
    },
  },
  computed: {
    title() {
      return "Your Transactions";
    },
    user() {
      return this.$store.state.user;
    },
    totalTransactions() {
      return this.meta.total;
    },
  },
  methods: {
    loadTransactions(page, type, date, category) {
      if (this.user) {
        this.$axios
          .get("vcards/" + this.user.id + "/transactions", {
            params: {
              page,
              type,
              date,
              category,
            },
          })
          .then((response) => {
            this.transactions = response.data.data;
            this.meta = response.data.meta;
            this.transactions.map((obj) => ({
              ...obj,
              moreTransaction: "false",
            }));
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

    edit(transaction) {
      this.$router.push({
        name: "EditingTransaction",
        params: { id: transaction.id, transactionVcard: transaction.vcard },
      });
    },
    addTransaction() {
      this.$router.push({ name: "NewTransaction" });
    },
  },
  mounted() {
    this.loadTransactions();
    this.loadCategories();
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

.btn-addTransaction {
  margin-top: 44px;
}
</style>
