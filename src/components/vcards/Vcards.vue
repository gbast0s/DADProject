<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2 titulo">
      <h3 class="mt-4">Vcards</h3>    
    </div>
    <a class="refresh" v-show="refresh" @click.prevent="loadVcards(1, filterByBlocked, filterByKeyWord, filterByMinBal, filterByMaxBal)">
      <i class="bi bi-arrow-clockwise"></i> 
      Refresh Vcards
    </a>  
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalVcards }}</h5>
    </div>
  </div>
  <hr />
  <div>
    <div class="mb-3 d-flex justify-content-between flex-wrap">
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
        <label for="selectCompleted" class="form-label mx-2 mt-2"
          >Filter by Blocked:</label
        >
        <select
          class="form-select"
          id="selectCompleted"
          v-model="filterByBlocked"
          @change="
            loadVcards(
              1,
              filterByBlocked,
              filterByKeyWord,
              filterByMinBal,
              filterByMaxBal
            )
          "
        >
          <option :value="null">Any</option>
          <option value="0">Not Blocked</option>
          <option value="1">Blocked</option>
        </select>
        <div>
          <label class="form-label mx-2 mt-2" for="keyWord"
            >Keyword to Filter:
          </label>
          <input
            class="form-control"
            id="keyWord"
            v-model="filterByKeyWord"
            placeholder="Name, Phone, Email"
            type="text"
          />
        </div>
      </div>
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
        <div class="double-input">
          <label class="form-label mx-2 mt-2" for="min-bal"
            >Min Balance:
          </label>
          <input
            class="form-control"
            v-model="filterByMinBal"
            type="number"
            id="min-bal"
            min="0"
            :max="filterByMaxBal"
          />
          <label class="form-label mx-2 mt-2" for="max-bal"
            >Max Balance:
          </label>
          <input
            class="form-control"
            v-model="filterByMaxBal"
            type="number"
            id="max-bal"
            :min="filterByMinBal"
          />
        </div>
      </div>
    </div>
    <div class="mx-2 mt-2 filtrar">
      <button
        type="button"
        class="btn btn-success px-4"
        @click="loadVcards(1, filterByBlocked, filterByKeyWord, filterByMinBal, filterByMaxBal)">
        <i class="bi bi-filter-right"></i>&nbsp; Filter Vcards
      </button>
    </div>
  </div>
  <vcard-table
    :vcards="vcards"
    :showPhoneNumber="true"
    :showOwner="true"
    @editing="edit"
    @deleting="deleteVcard"
  ></vcard-table>
  <pagination
    :meta="meta"
    @pagination="
      loadVcards(
        $event,
        filterByBlocked,
        filterByKeyWord,
        filterByMinBal,
        filterByMaxBal
      )
    "
  ></pagination>
</template> 

<script>
import Pagination from "../global/Pagination.vue";
import VcardTable from "./VcardTable.vue";

export default {
  name: "Vcards",
  components: {
    VcardTable,
    Pagination,
  },
  data() {
    return {
      vcards: [],
      filterByBlocked: null,
      filterByMinBal: null,
      filterByMaxBal: null,
      filterByKeyWord: null,
      meta: [],
      refresh: false
    };
  },
  watch: {
    filterByKeyWord: {
      immediate: true,
      handler(newValue) {
        if (newValue === "") {
          this.loadVcards(
            1,
            this.filterByBlocked,
            null,
            this.filterByMinBal,
            this.filterByMaxBal
          );
          this.filterByKeyWord = null;
        }
      },
    },
    filterByMinBal: {
      immediate: true,
      handler(newValue) {
        if (newValue === "") {
          this.loadVcards(
            1,
            this.filterByBlocked,
            this.filterByKeyWord,
            null,
            this.filterByMaxBal
          );
          this.filterByMinBal = null;
        }
      },
    },
    filterByMaxBal: {
      immediate: true,
      handler(newValue) {
        if (newValue === "") {
          this.loadVcards(
            1,
            this.filterByBlocked,
            this.filterByKeyWord,
            this.filterByMinBal,
            null
          );
          this.filterByMaxBal = null;
        }
      },
    },
  },
  computed: {
    totalVcards() {
      return this.meta.total;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    loadVcards(page, blocked, field, minBalance, maxBalance) {
      this.$axios
        .get("vcards", {
          params: {
            page,
            blocked,
            field,
            minBalance,
            maxBalance,
          },
        })
        .then((response) => {
          if(this.refresh)
          {
            this.refresh = false
          }
          this.vcards = response.data.data;
          this.meta = response.data.meta;
          this.vcards.map((obj) => ({ ...obj, addTransaction: "false" }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    edit(vcard) {
      this.$router.push({
        name: "EditingVcard",
        params: { phone_number: vcard.phone_number },
      });
    },
    deleteVcard(deletedVcard, flag) {
      let idx = this.vcards.findIndex(
        (t) => t.phone_number === deletedVcard.phone_number
      );
      if (idx >= 0) {
        this.vcards.splice(idx, 1);
        if(flag == null)
        {
          this.$toast.success("Vcard #" + deletedVcard.phone_number + " deleted successfully");
        }
      }
      this.meta.total = this.meta.total - 1;
    },
  },
  sockets: {
    deletingVcard(vcard){
      this.deleteVcard(vcard, true)
    },
    newVcard() {
      this.refresh = true
    },
    updateVcard(vcard)
    {
      let idx = this.vcards.findIndex(
        (t) => t.phone_number === vcard.phone_number
      );  
      if(idx >= 0)
      {
        this.vcards[idx] = vcard
      }
    },
    blockedUser(vcard)
    {
      let idx = this.vcards.findIndex(
        (t) => t.phone_number === vcard.phone_number
      );  
      if(idx >= 0)
      {
        this.vcards[idx] = vcard
      }
    }
  },
  mounted() {
    this.loadVcards();
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

.mx-2.mt-2.filtrar {
  text-align: center;
  margin-bottom: 20px;
}

.mx-2.titulo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.refresh {
  margin-top: 18px;
  margin-left: 20px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
