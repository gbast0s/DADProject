<template>
  <div
    class="
      d-flex
      justify-content-between
      flex-wrap flex-md-nowrap
      align-items-center
      pt-3
      pb-2
      mb-3
      border-bottom
    "
  >
    <h1 class="h2">Dashboard</h1>
  </div>
  <div v-if="user" class="container p-3 my-3 border rounded d-flex flex-column">
    <div class="container p-3 my-3 border rounded bg-light text-black">
      <div class="row" v-if="user ? user.user_type == 'V' : false">
        <div class="col-sm">
          <img
            :src="userPhotoUrl"
            class="rounded-circle z-depth-0 avatar-img2"
            alt="avatar image"
          />
        </div>
        <div class="col-sm row">
          <div>
            <div class="user-profile" style="white-space: nowrap"
              ><h6 style="display: inline-block">User Name: &nbsp;</h6>
              <p style="display: inline-block" class="username">
                {{ user.name }}
              </p>
            </div>
          </div>
          <div v-if="user ? user.user_type == 'V' : false">
            <a style="white-space: nowrap"
              ><h6 style="display: inline-block">Your Max debit: &nbsp;</h6>
              <p style="display: inline-block" class="balance">
                {{ user.max_debit }}€
              </p>
            </a>
          </div>
        </div>
        <div class="col-sm d-flex align-center justify-content-center">
          <button
            type="button"
            class="btn btn-success px-4 my-4 btn-addTransaction"
            @click="editAccount(user)"
          >
            <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Edit Account
          </button>
        </div>
      </div>
      <div class="column" v-if="user ? user.user_type == 'A' : false">
        <div class="centerOnDiv">
          <img
            :src="userPhotoUrl"
            class="rounded-circle z-depth-0 centerImg"
            alt="avatar image"
          />
        </div>
        <div class="col-sm row">
          <div class="centerTxt">
            <a style="white-space: nowrap"
              ><h6 style="display: inline-block">User Name: &nbsp;</h6>
              <p style="display: inline-block" class="username">
                {{ user.name }}
              </p>
            </a>
          </div>
        </div>
        <div class="col-sm d-flex align-center justify-content-center">
          <button
            type="button"
            class="btn btn-success px-4 my-4 btn-addTransaction"
            @click="editAccount(user)"
          >
            <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Edit Account
          </button>
        </div>
      </div>
      
    </div>
    <div
      class="container p-3 my-3 border rounded bg-light text-black"
      v-if="user ? user.user_type == 'A' : false"
    >
      <div class="column">
        <div class="row">
          <div class="col-sm">
            <div class="statistics-group" style="white-space: nowrap"
              ><h5 class="statistics" style="display: inline-block">
                Value of Transactions made today: &nbsp;
              </h5>
              <p style="display: inline-block" class="username">
                {{ adminStatistics.transactionsTotalToday }} €
              </p>
            </div>
          </div>
          <div class="col-sm">
            <div class="statistics-group" style="white-space: nowrap"
              ><h5  class="statistics" style="display: inline-block">
                Number of Transactions made today: &nbsp;
              </h5>
              <p style="display: inline-block" class="username">
                {{ adminStatistics.transactions_made_today ? adminStatistics.transactions_made_today : 0}} 
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <div class="statistics-group" style="white-space: nowrap"
              ><h5  class="statistics" style="display: inline-block">
                Balance of all vcards: &nbsp;
              </h5>
              <p style="display: inline-block" class="username">
                {{ parseFloat(adminStatistics.total_balance).toFixed(2) }} €
              </p>
            </div>
          </div>
          <div class="col-sm">
            <div class="statistics-group"  style="white-space: nowrap"
              ><h5  class="statistics" style="display: inline-block">
                Number of Vcards: &nbsp;
              </h5>
              <p style="display: inline-block" class="username">
                {{ adminStatistics.total_vcards }} 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="container p-3 my-3 border rounded bg-light text-black"
      v-if="user ? user.user_type == 'V' : false"
    >
      <div class="row">
        <div class="col-sm">
          <a style="white-space: nowrap"
            ><h5 style="display: inline-block">Nº of Transactions: &nbsp;</h5>
            <p style="display: inline-block" class="username">
              {{ transactions.length }}
            </p>
          </a>
        </div>
      </div>
      <div class="row">
        <div>
          <a style="white-space: nowrap"
            ><h6 style="display: inline-block">Nº of Debits: &nbsp;</h6>
            <p style="display: inline-block" class="balance">
              {{ transactions.length - totalCredit }}
            </p>
          </a>
        </div>
        <div>
          <a style="white-space: nowrap"
            ><h6 style="display: inline-block">Nº of Credits: &nbsp;</h6>
            <p style="display: inline-block" class="balance">
              {{ totalCredit }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <div
      class="border-bottom my-3"
      v-if="transactions.length > 1 && this.lineChartData.length > 2"
    >
      <h5>Balance Graphics:</h5>
      <GChart
        v-if="user ? user.user_type == 'V' : false"
        type="LineChart"
        :data="lineChartData"
        :options="lineChartOptions"
      />
    </div>
    <div v-if="transactions.length > 1 && this.barChartData.length > 2">
      <h5>Category Statistics:</h5>
      <GChart
        v-if="user ? user.user_type == 'V' : false"
        type="ColumnChart"
        :data="barChartData"
        :options="barChartOptions"
      />
    </div>
    <div v-if="user ? user.user_type == 'A' : false">
      <h5 class="mt-3">Number of transactions made per year:</h5>
      <GChart
        type="LineChart"
        :data="TransChartData"
        :options="TransChartOptions"
      />
    </div>
    <div v-if="user ? user.user_type == 'A' : false">
      <hr/>
      <h5>Types of payment used :</h5>
      <GChart
        type="ColumnChart"
        :data="TypeChartData"
        :options="TypeChartOptions"
      />
    </div>
  </div>
</template>

<script>
import GChart from "vue-google-charts/src/components/GChart.vue";

export default {
  name: "Dashboard",
  components: {
    GChart,
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      adminStatistics: [],
      barChartOptions: {},
      lineChartOptions: {
        vAxis: {
          title: "Balance",
        },
        hAxis: {
          type: "date",
        },
      },
      transactions: [],
      lineChartData: [["Date", "Balance"]],
      barChartData: [["Category (amount)", "Times Used", { role: "style" }]],
      TransChartData: [["Year", "Total Transactions"]],
      TypeChartData: [["Type", "Total Used"]],
      TransChartOptions: {
        chart: {
          title: "Types used",
        },
        hAxis: {
          type: "date",
        },
      },
      TypeChartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
        hAxis: {
          type: "date",
        },
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userPhotoUrl() {
      let urlPhoto = this.user ? this.user.photo_url : null;
      return urlPhoto
        ? this.$serverUrl + "/storage/fotos/" + urlPhoto
        : "img/avatar-none.png";
    },

    totalCredit() {
      return this.transactions.reduce((c, t) => (t.type == "C" ? c + 1 : c), 0);
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.lineChartData = [["Date", "Balance"]];
          this.barChartData = [
            ["Category (amount)", "Times Used", { role: "style" }],
          ];
          this.TransChartData = [["Year", "Total Transactions"]];
          this.TypeChartData = [["Type", "Total Used"]];
          this.buildData(newValue);
        }
      },
    },
  },

  methods: {
    buildData(user) {
      if (user && user.user_type == "V") {
        this.$axios
          .get("vcards/" + this.user.id + "/transactions/data")
          .then((response) => {
            this.transactions = response.data.data;
            if (this.transactions.length > 1) {
              response.data.data.forEach((transaction) => {
                var data = new Date(transaction.date);
                if (
                  this.lineChartData[this.lineChartData.length - 1][0] ==
                  data.toString()
                ) {
                  this.lineChartData[this.lineChartData.length - 1] = [
                    data,
                    parseInt(transaction.new_balance),
                  ];
                } else
                  this.lineChartData.push([
                    data,
                    parseInt(transaction.new_balance),
                  ]);
              });

              let today = new Date(); //data de hoje
              today.setHours(0, 0, 0, 0);

              if (
                this.lineChartData[this.lineChartData.length - 1][0].setHours(
                  0,
                  0,
                  0,
                  0
                ) == today.setHours(0, 0, 0, 0) //sobrepor caso a ultima transação seja no mesmo dia de hoje
              ) {
                this.lineChartData[this.lineChartData.length - 1] = [
                  today,
                  user.balance,
                ];
              } else {
                this.lineChartData.push([new Date(), user.balance]); //se não adiciona a transação
              }
            }
          });

        this.$axios
          .get("vcards/" + this.user.id + "/categories/transactions")
          .then((response) => {
            response.data.data.forEach((cat) => {
              if (cat != null)
                this.barChartData.push([
                  cat.category.name + " (" + cat.ammountUsed + "€)",
                  cat.categoryCount,
                  "color: #444444",
                ]);
            });
          });
      } else if (user && user.user_type == "A") {
        this.$axios.get("statistics").then((response) => {
          this.adminStatistics = response.data;
          response.data.transactions_per_year.forEach((transactions) => {
            if (transactions != null)
              this.TransChartData.push([transactions.date, transactions.count]);
          });

          response.data.count_types.forEach((count_type) => {
            if (count_type != null)
              this.TypeChartData.push([
                count_type.payment_type,
                count_type.count,
              ]);
          });
        });
      }
    },
    editAccount(user) {
      if(this.user.user_type == "A")
      {
        this.$router.push({name: "EditingAdmin",params: { id: user.id },});
      }
      else
      {
        this.$router.push({name: "EditingVcard",params: { phone_number: user.id },});
      }
    },
  },
  // sockets: {
  //   newTransaction() {
  //     this.lineChartData = [["Date", "Balance"]];
  //     this.barChartData = [
  //       ["Category (amount)", "Times Used", { role: "style" }],
  //     ];
  //     this.TransChartData = [["Year", "Total Transactions"]];
  //     this.TypeChartData = [["Type", "Total Used"]];
  //     this.buildData(this.user);
  //   },
  // },
  mounted() {
    // this.buildData();
  },
};
</script>

<style scoped>
.avatar-img2 {
  margin: -2.2px 0.8px -2px 0.8px;
  width: 75px;
  height: 75px;
}

.username,
.balance {
  font-size: 16px;
}

.centerImg{
  width: 110px;
  height: 110px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.centerTxt{
  text-align: center;
  margin-top: 20px;
}

.statistics-group {
  display: flex;
  flex-direction: column;
  text-align: center;
}

@media (max-width: 465px) {
  h5.statistics {
    font-size: 90%;
  } 
}

@media (max-width: 445px)
{
  .user-profile{
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    font-size: 90%;
  }

  .username{
    font-size: 120%;
  }
}

</style>
