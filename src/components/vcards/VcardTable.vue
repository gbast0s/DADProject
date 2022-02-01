<template>
  <confirmation-dialog
    ref="confirmationDialog"
    confirmationBtn="Delete vcard"
    :msg="`Do you really want to delete the vcard ${vcardToDeleteMessage}?`"
    @confirmed="deleteConfirmed"
  >
  </confirmation-dialog>
  <div style="overflow-x:auto;">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showPhoneNumber">Phone Number</th>
          <th v-if="showPhoto">Photo</th>

          <th v-if="showOwner">Owner</th>
          <th v-if="showEmail">Email</th>
          <th v-if="showBalance">Balance</th>
          <th v-if="showMaxDebit">Max Debit</th>
          <th v-if="showBlocked">Blocked</th>
          <th class="other-stuff" v-if="showEditButton || showDeleteButton || showAddButton">Other Stuff</th>
        </tr>
      </thead>
      <tbody v-for="vcard in editingVcards" :key="vcard.id">
        <tr>
          <td class="align-middle" v-if="showPhoneNumber">{{ vcard.phone_number }}</td>
          <td class="align-middle" v-if="showPhoto">
            <img :src="photoFullUrl(vcard)" class="rounded-circle img_photo" />
          </td>
          <td class="align-middle" v-if="showOwner">{{ vcard.name }}</td>
          <td class="align-middle" v-if="showEmail">{{ vcard.email }}</td>
          <td class="align-middle" v-if="showBalance">{{ vcard.balance }}€</td>
          <td class="align-middle" v-if="showMaxDebit">{{ vcard.max_debit }}</td>
          <td class="align-middle" v-if="showBlocked">
            <div class="d-flex">
              <button
                class="btn btn-xs btn-light"
                @click="toogleClick(vcard)"
                v-if="showBlocked"
              >
                <i
                  class="bi bi-xs"
                  :class="{
                    'bi-square': !vcard.blocked,
                    'bi-check2-square': vcard.blocked,
                  }"
                ></i>
              </button>
            </div>
          </td>
          <td class="align-middle" v-if="showEditButton || showDeleteButton || showAddButton">
            <div class="d-flex">
              <button
                class="btn btn-xs btn-light"
                @click="editVcard(vcard)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>

              <button
                class="btn btn-xs btn-light"
                @click="deleteVcard(vcard)"
                v-if="showDeleteButton"
              >
                <i class="bi bi-xs bi-x-square-fill"></i>
              </button>

              <button
                class="btn btn-xs btn-light"
                @click="addTransaction(vcard)"
                v-if="showAddButton"
              >
                <i class="bi bi-currency-exchange"></i>
              </button>
            </div>
          </td>
        </tr>

        <td colspan="100%" v-if="vcard.addTransaction">
          <vcard-new-transaction @save="createTransaction(vcard, $event)">
          </vcard-new-transaction>
        </td>
      </tbody>
    </table>
  </div>
</template>

<script>
import VcardNewTransaction from "./VcardNewTransaction";

export default {
  name: "VcardTable",
  props: {
    vcards: {
      type: Array,
      default: () => [],
    },
    showPhoneNumber: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: true,
    },

    showPhoto: {
      type: Boolean,
      default: true,
    },
    showOwner: {
      type: Boolean,
      default: true,
    },
    showBlocked: {
      type: Boolean,
      default: true,
    },
    showAddButton: {
      type: Boolean,
      default: true,   
    },
    showMaxDebit: {
      type: Boolean,
      default: true,
    },
    showBalance: {
      type: Boolean,
      default: true,
    },

    showEditButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["editing", "deleting"],
  components: {
    VcardNewTransaction,
  },
  data() {
    return {
      vcardTransaction: null,
      editingVcards: this.vcards,
      vcardToDelete: null,
    };
  },
  watch: {
    vcards(newVcards) {
      this.editingVcards = newVcards;
    },
  },
  computed: {
    vcardToDeleteMessage() {
      return this.vcardToDelete
        ? `#${this.vcardToDelete.phone_number} - ${this.vcardToDelete.name}`
        : "";
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    photoFullUrl(vcard) {
      return vcard.photo_url
        ? this.$serverUrl + "/storage/fotos/" + vcard.photo_url
        : "img/avatar-none.png";
    },
    toogleClick(vcard) {
      this.$axios
        .patch("vcards/" + vcard.phone_number + "/blocked", {
          blocked: !vcard.blocked,
        })
        .then((response) => {
          vcard.blocked = response.data.data.blocked;
          let status = vcard.blocked ? "blocked" : "unblocked";
          this.$toast.success(
            "Vcard #" + vcard.phone_number + " was " + status + " successfully."
          );
          this.$socket.emit("blockedUser", vcard, this.user);

          //this.$emit('completeToggled', vcard)
        })
        .catch((error) => {
          this.$toast.error(
            "Vcard was not created due to unknown server error!"
          );
          console.log(error);
        });
    },
    createTransaction(vcard, transaction) {
      this.$axios
        .post("vcards/" + vcard.phone_number + "/transactions", transaction)
        .then((response) => {
          vcard.balance = response.data.data.new_balance;
          this.$toast.success(transaction.value + "€ has been added to Vcard #" +  vcard.phone_number);
          transaction.vcard = vcard.phone_number
          this.$socket.emit("newTransaction", transaction, this.user);
        })
        .catch((error) => {
          this.$toast.error(
            error.response.status == 422
              ? Object.values(error.response.data.errors)[0][0]
              : error.response.data.error
          );
        });
    },
    editVcard(vcard) {
      this.$emit("editing", vcard);
    },
    deleteConfirmed() {
      this.$axios
        .delete("vcards/" + this.vcardToDelete.phone_number)
        .then((response) => {
          this.$emit("deleting", response.data.data);
          this.$socket.emit("deletingVcard", this.vcardToDelete, this.user);
        })
        .catch((error) => {
          this.$toast.error(error.response.data.balance);
        });
    },
    addTransaction(vcard) {
      vcard.addTransaction = !vcard.addTransaction;
    },
    deleteVcard(vcard) {
      this.vcardToDelete = vcard;
      let dlg = this.$refs.confirmationDialog;
      dlg.show();
    },
  },
};
</script>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}
.img_photo {
  width: 3.2rem;
  height: 3.2rem;
}

button.btn.btn-xs.btn-light {
  height: 45px;
}

thead {
  border-bottom: 2px solid currentColor;
}

.table > :not(:first-child) {
  border-top: none;
}

th.other-stuff {
    text-align: center;
}
</style>
