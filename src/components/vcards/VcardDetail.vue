<template>
    <div :class="operationType == 'update' ? 'w-75 pe-4' : '' ">
      <div class="mb-3">
        <label
          for="inputPhoneNumber"
          class="form-label"
        >Phone Number</label>
        <input
          type="number"
          class="form-control"
          id="inputPhoneNumber"
          required
          v-model="editingVcard.phone_number"
          :disabled="operationType!='register'"
        >
        <field-error-message
          :errors="errors"
          fieldName="phone_number"
        ></field-error-message>
      </div>
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
          v-model="editingVcard.name"
          :disabled="operationType=='update_debit'"
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
          v-model="editingVcard.email"
          :disabled="operationType=='update_debit'"
        >
        <field-error-message
          :errors="errors"
          fieldName="email"
        ></field-error-message>
      </div>
      <div class="mb-3" v-if="operationType=='register'">
        <label
          for="inputPassword"
          class="form-label"
        >Password</label>
        <input
          type="password"
          class="form-control"
          id="inputPassword"
          required
          v-model="editingVcard.password"
        >
        <field-error-message
          :errors="errors"
          fieldName="password"
        ></field-error-message>
      </div>
      <div class="mb-3" v-if="operationType=='register'">
        <label
          for="inputConfirmationCode"
          class="form-label"
        >Confirmation Code</label>
        <input
          type="password"
          class="form-control"
          id="inputConfirmationCode"
          required
          v-model="editingVcard.confirmation_code"
        >
        <field-error-message
        :errors="errors"
        fieldName="confirmation_code"
        ></field-error-message>
      </div>
      <div class="mb-3" v-if="operationType!='update_debit'">
          <label for="photo" class="form-label">Photo</label>
          <input class="form-control" type="file" id="photo" accept="image/png, image/jpeg" @change="onChangePhotoSelected">
          <field-error-message
          :errors="errors"
          fieldName="photo_url"
          ></field-error-message>
      </div>
      <div class="mb-3" v-if="operationType=='update_debit'">
          <label
            for="inputConfirmationCode"
            class="form-label"
          >Max Debit</label>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              id="inputConfirmationCode"
              required
              v-model="editingVcard.max_debit"
            >          
            <span class="input-group-text">€</span>
          <field-error-message
          :errors="errors"
          fieldName="max_debit"
          ></field-error-message>
        </div>
      </div>
      <div :class="operationType == 'register' ? 'mb-3 d-flex justify-content-center' : 'mb-3 d-flex justify-content-end buttons'">
        <button 
          v-if="operationType=='update'"
          type="button"
          class="btn btn-danger"
          @click="deleteVcard"
        >Delete Account</button>
        <div :class="operationType == 'register' ? 'buttons' : ''">
          <button
            type="button"
            :class="operationType == 'register' ? 'btn btn-primary px-5 register' : 'btn btn-primary px-5 update'"
            @click="update"
          >{{buttonTitle}}</button>
          <button
            type="button"
            class="btn btn-dark px-5"
            v-if="operationType == 'register'"
            @click="login"
          >Login</button>
        </div>
        <button v-if="operationType!='register'"
          type="button"
          class="btn btn-light px-5"
          @click="cancel"
        >Cancel</button>
      </div>
    </div>
    <div class="w-25 photo-user" v-if="operationType=='update'">
      <div class="mb-3">
        <label class="form-label">Photo</label>
        <div class="form-control text-center photo-user">
          <img
            :src="oldPhotoUrl ? (this.$serverUrl + '/storage/fotos/' + oldPhotoUrl) : 'img/avatar-none.png'"
            class="w-100"
          >
        </div>
      </div>
    </div>
</template>

<script> 

export default {
  name: 'VcardDetail',
  data () {
    return {
      editingVcard: this.vcard,
      oldPhotoUrl: null,
    }
  },
  props: {
    vcard: {
      type: Object,
      required: true
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
    vcard (newVcard) {
      this.editingVcard = newVcard
      this.oldPhotoUrl = newVcard.photo_url
    },
  },
  emits: [
    'updateRegist',
    'cancel',
    'detroy'
  ],
  computed:
  {
    buttonTitle()
    {
      return this.operationType != 'register' ? 'Save' : 'Register'
    }
  },
  methods: {

    deleteVcard()
    {
      this.$emit('detroy')
    },
    update ()
    {
      this.$emit('updateRegist')
    },
    cancel()
    {
      this.$emit('cancel')
    },
    onChangePhotoSelected (event)
    {
        this.editingVcard.photo_url = event.target.files[0]
    },
    login()
    {
      this.$router.push({name: "Login"});
    }
  },
  sockets: {
    updateVcard(vcard)
    {
      if(this.editingVcard.phone_number == vcard.phone_number)
      {
        this.editingVcard = vcard;
      }
    }
  }
}
</script>

<style scoped>

.form-control.text-center.photo-user{
  max-width: 70%;
}

.btn.btn-danger{
  margin-right: 20px;
}

@media (max-width: 648px)
{
  .buttons{
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .mb-3.d-flex.justify-content-end.buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button.btn.btn-danger
  {
    margin: 0;
  }

  .btn.btn-primary.px-5
  {
    margin: 10px 0 0 0;
  }

  .btn.btn-primary.px-5
  {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>