<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ title }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalCategories }}</h5>
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
        id="selectCompleted"
        v-model="type"
        @change="loadCategories(1, type)"
      >
        <option :value="null">All</option>
        <option value="C">Credit (C)</option>
        <option value="D">Debit (D)</option>
      </select>
    </div>
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addCategory"
        @click="addCategory"
      >
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Category
      </button>
    </div>
  </div>

  <category-table
    :categories="categories"
    @edit="editCategory"
    @delete="deleteCategory"
  ></category-table>
  <pagination
    :meta="meta"
    @pagination="loadCategories($event, type)"
  ></pagination>
</template>

<script>
import CategoryTable from "./CategoryTable.vue";

export default {
  name: "Categories",
  components: {
    CategoryTable,
  },

  data() {
    return {
      categories: [],
      meta: [],
      // filterByType: -1,
      type: null,
    };
  },
  computed: {
    // filteredCategories() {
    //   return this.categories.filter(
    //     (t) =>
    //       this.filterByType == -1 ||
    //       (this.filterByType == 0 && t.type == "C") ||
    //       (this.filterByType == 1 && t.type == "D")
    //   );
    // },
    title() {
      if (this.user) {
        if (this.user.user_type == "V") {
          return "Your Categories";
        } else {
          return "Default Categories";
        }
      }

      return "Categories";
    },
    user() {
      return this.$store.state.user;
    },
    totalCategories() {
      return this.meta.total;
    },
  },

  methods: {
    loadCategories(page, field) {
      this.$axios
        .get(
          this.user.user_type == "A"
            ? "defaultcategories"
            : this.user.user_type == "V"
            ? "vcards/" + this.user.id + "/categories"
            : "categories",
          {
            params: {
              page,
              field,
            },
          }
        )
        .then((response) => {
          this.categories = response.data.data;
          this.meta = response.data.meta;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCategory() {
      this.$router.push({ name: "NewCategory" });
    },
    //editCategory(category) {
    //  this.$router.push({ name: "Category", params: { id: category.id } });
    //},
    editCategory(category) {
      this.$router.push({
        name: "EditingCategory",
        params: { id: category.id, vcard: category.vcard },
      });
    },

    deleteCategory(deletedCategory, flag) {
      if (this.user.user_type == "A") {
            let idx = this.categories.findIndex((t) => t.id === deletedCategory.id);
            if (idx >= 0) {
              this.categories.splice(idx, 1);
              if(flag == null)
              {
                this.$toast.success("Category #" + deletedCategory.id + " deleted successfully");
              }
            }
            this.meta.total = this.meta.total - 1;
      } else {
        let idx = this.categories.findIndex((t) => t.id === deletedCategory.id);
        if (idx >= 0) {
          this.categories.splice(idx, 1);
          this.$toast.success("Category #" + deletedCategory.name + " deleted successfully");
          this.meta.total = this.meta.total - 1;
        }
      }
    },
  },
  sockets: {
    newCategory(category) {
      this.categories.push(category);
      this.meta.total = this.meta.total + 1
    },
    updateCategory(category) {
      let idx = this.categories.findIndex(
        (t) => t.id === category.id
      );  
      if(idx >= 0)
      {
        this.categories[idx] = category
      }
    },
    deletingCategory(category) {
      this.deleteCategory(category, true);
    },
  },
  mounted() {
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
.btn-addCategory {
  margin-top: 2.25rem;
}
</style>
