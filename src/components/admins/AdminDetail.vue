<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="save"
  >
    <h3 class="mt-5 mb-3">{{operationType == 'create' ? 'Create Admin' : 'Admin #' + this.editingUser.id }}</h3>
    <hr>
    <div class="mb-3">
      <label
        for="inputName"
        class="form-label"
      >Name</label>
      <input
        type="text"
        class="form-control"
        id="inputName"
        required
        v-model="editingUser.name"
      >
      <field-error-message
        :errors="errors"
        fieldName="name"
      ></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputEmail"
        class="form-label"
      >Email</label>
      <input
        type="text"
        class="form-control"
        id="inputEmail"
        required
        v-model="editingUser.email"
      >
      <field-error-message
        :errors="errors"
        fieldName="email"
      ></field-error-message>
    </div>
    <div class="mb-3" v-if="operationType == 'create'">
      <label
        for="inputPassword"
        class="form-label"
      >Password</label>
      <input
        type="password"
        class="form-control"
        id="inputPassword"
        required
        v-model="editingUser.password"
      >
      <field-error-message
        :errors="errors"
        fieldName="password"
      ></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-end buttons">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="save"
      >Save</button>
      <button
        type="button"
        class="btn btn-light px-5"
        @click="cancel"
      >Cancel</button>
    </div>

  </form>
</template>

<script>
export default {
  name: 'AdminDetail',
  components: {
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: null
    },
    operationType : {
      type: String,
    }
  },
  emits: [
    'save',
    'cancel'
  ],
  data () {
    return {
      editingUser: this.user
    }
  },
  watch: {
    user (newUser) {
      this.editingUser = newUser
    },
  },
  methods: {
    save () {
      this.$emit('save', this.editingUser)
    },
    cancel () {
      this.$emit('cancel', this.editingUser)
    },
  },
  sockets: {
    updateAdmin(admin) {
      if(this.editingUser.id == admin.id)
      {
        this.editingUser = admin
      }
    },
  }
}
</script>

<style scoped>
.total_hours {
  width: 26rem;
}

@media (max-width: 648px)
{
  .mb-3.d-flex.justify-content-end.buttons{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn.btn-primary.px-5 {
    margin: 0 0 10px 0;
}
}
</style>
