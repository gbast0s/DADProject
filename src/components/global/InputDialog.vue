<template>
  <!-- Button trigger to Show modal - HIDDEN -->
  <button
    ref="hiddenButtonToShowDialog"
    type="button"
    class="d-none"
    data-bs-toggle="modal"
    data-bs-target="#inputModalId"
  >
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="inputModalId"
    tabindex="-1"
    aria-labelledby="inputModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <!-- Button trigger to Hide modal - HIDDEN -->
      <button
        ref="hiddenButtonToHideDialog"
        type="button"
        class="d-none"
        data-bs-dismiss="modal"
      >
      </button>

      <div class="modal-content">
        <div class="modal-header">
          <h5
            class="modal-title"
            id="inputModalLabel"
          >{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ msg }}
          <input
            type="password"
            class="form-control"
            id="inputConfirmationPassword"
            required
            v-model="input"
            v-if="operation == 'update' || operation == 'destroy'"
          >
          <div class="text-danger password" v-if="operation == 'update' || operation == 'destroy'">
            {{error}}
          </div>
          {{ msgCode }}
          <input
            type="password"
            class="form-control"
            id="inputConfirmationCodeDialog"
            required
            v-model="inputCode"
            v-if="operation == 'destroy' || operation == 'transaction'"
          >
          <div class="text-danger"  v-if="operation == 'destroy' || operation == 'transaction'">
            {{errorCode}}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >{{ cancelBtn }}</button>
          <button
            v-if="operation == 'update' || operation == 'transaction'"
            type="button"
            class="btn btn-primary"
            @click="clickConfirm"
          >{{ confirmationBtn }}</button>
          <button
            v-if="operation == 'destroy'"
            type="button"
            class="btn btn-danger"
            @click="clickConfirm"
          >Delete account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputDialog',
  data()
  {
    return {
      input: null,
      inputCode: null
    }
  },
  props: {
    cancelBtn: {
      type: String,
      default: 'Cancel'
    },
    confirmationBtn: {
      type: String,
      default: 'Confirm'
    },
    title: {
      type: String,
      default: 'Confirmation'
    },
    msg: {
      type: String,
      default: ''
    },
    msgCode: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: null
    },
    errorCode: {
      type: String,
      default: null
    },
    operation: {
      type: String,
      default: 'update'
    }

  },
  emits: [
    'show',
    'hide',
    'inputDialog'
  ],
  methods: {
    show () {
      //Easy way to show the modal:
      let btnToShowModal = this.$refs.hiddenButtonToShowDialog
      btnToShowModal.click()
      this.$emit('show')
    },
    hide () {
      //Easy way to hide the modal:
      let btnToHideModal = this.$refs.hiddenButtonToHideDialog
      btnToHideModal.click()
      this.$emit('hide')
    },
    clickConfirm () {
      this.hide()
      if(this.operation == "destroy")
      {
        let fields = {
          "password": this.input,
          "code": this.inputCode
        }
        this.$emit('inputDialog', fields)
      }
      else if (this.operation == "transaction"){
        this.$emit('inputDialog', this.inputCode)
      }
      else
      {
        this.$emit('inputDialog', this.input)
      }
      this.input = null
      this.inputCode = null
    },
  }
}
</script>

<style scoped>
input#inputConfirmationPassword {
    margin-top: 10px;
}

input#inputConfirmationCodeDialog {
    margin-top: 10px;
}

.text-danger.password {
    margin-bottom: 30px;
}


</style>