<template>
  <v-row justify="center">
    <v-dialog eager v-model="dialog.edit">
      <v-card>
        <v-card-title
          class="subheading primary--text font-weight-bold px-4 py-3"
        >
          {{ title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0 px-4">
          <v-row class="mt-2">
            <v-col cols="12">
              <v-text-field
                append-icon="mdi-pencil"
                class="text-capitalize"
                color="primary"
                hide-details
                label="Descrição"
                outlined
                ref="description"
                v-model="currentBill.description"
                v-uppercase
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6">
              <v-select
                append-icon="mdi-plus-minus-variant"
                color="primary"
                hide-details
                label="Modalidade"
                outlined
                :items="modality"
                v-model="currentBill.modality"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                append-icon="mdi-currency-usd"
                color="primary"
                hide-details
                label="Valor"
                outlined
                ref="value"
                type="number"
                v-model="currentBill.value"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6">
              <v-dialog
                ref="dialogEditDate"
                v-model="dialog.editDate"
                :return-value.sync="currentBill.date"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    color="primary"
                    hide-details
                    label="Data de vencimento"
                    v-model="billDateFormatted"
                    outlined
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="primary"
                  locale="pt-br"
                  v-model="currentBill.date"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mb-3 mr-2"
                    color="primary"
                    large
                    outlined
                    @click="dialog.editDate = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    class="mb-3"
                    color="primary"
                    dark
                    large
                    @click="$refs.dialogEditDate.save(currentBill.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6">
              <v-dialog
                ref="dialogEditRepeatUntil"
                v-model="dialog.editRepeatUntil"
                :return-value.sync="currentBill.repeatUntil"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    color="primary"
                    hide-details
                    label="Repetir até"
                    outlined
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="Boolean(currentBill.id)"
                    :value="billRepeatUntilFormatted"
                    @click:clear="currentBill.repeatUntil = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="primary"
                  locale="pt-br"
                  scrollable
                  type="month"
                  v-model="currentBill.repeatUntil"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mb-3 mr-2"
                    color="primary"
                    large
                    outlined
                    @click="dialog.editRepeatUntil = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    class="mb-3"
                    color="primary"
                    dark
                    large
                    @click="
                      $refs.dialogEditRepeatUntil.save(currentBill.repeatUntil)
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="12">
              <v-switch
                class="mt-0"
                color="primary"
                inset
                v-model="currentBill.situation"
              >
                <template v-slot:label>
                  <v-chip
                    class="justify-center"
                    :color="situation.color"
                    dark
                    small
                  >
                    {{ situation.text }}
                  </v-chip>
                </template>
              </v-switch>
            </v-col>
          </v-row>

          <v-alert
            v-if="errorsList.length"
            border="left"
            colored-border
            elevation="3"
            icon="mdi-alert"
            prominent
            type="warning"
          >
            <v-list-item
              v-for="(errorMessage, index) in errorsList"
              :key="index"
            >
              <v-list-item-icon>
                <v-icon v-text="'mdi-chevron-right'"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="errorMessage"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-alert>
        </v-card-text>
        <v-card-actions class="pt-0 pb-4">
          <v-row>
            <v-col class="d-flex justify-end align-center" cols="12">
              <v-btn
                class="mr-2"
                color="primary"
                large
                outlined
                @click="cancel"
              >
                Cancelar
              </v-btn>
              <v-btn color="primary" dark large @click="save"> Salvar </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.v-application--is-ltr .v-alert__icon {
  margin-right: 10px !important;
}

.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 0 !important;
}

.v-date-picker-header__value div button {
  text-transform: capitalize !important;
}

.v-list-item {
  min-height: 40px;
  padding: 0 !important;
}

.v-list-item__icon {
  margin: 9px 0 0 !important;
}
</style>

<script>
import { computed } from "@/computed";
import { differenceBetweenDates } from "@/date";

export default {
  data() {
    return {
      errorsList: [],
    };
  },
  directives: {
    uppercase: {
      inserted: (el, _, vnode) => {
        el.addEventListener("input", async function (e) {
          e.target.value = e.target.value.toUpperCase();
          vnode.componentInstance.$emit("input", e.target.value.toUpperCase());
        });
      },
    },
  },
  mixins: [computed],
  methods: {
    // Função para cancelar a edição da conta
    cancel() {
      // Limpa as mensagens de erro
      this.errorsList = [];

      // Fecha o diálogo de edição
      this.dialog.edit = false;

      // Reseta a conta atual selecionada
      setTimeout(() => {
        this.currentBill = "";
      }, 100);
    },
    // Função para salvar a conta que está sendo editada
    save() {
      this.errorsList = [];

      if (!this.currentBill.description.trim()) {
        this.errorsList.push("Descrição deve ser preenchida.");
      }

      if (!Number(this.currentBill.value)) {
        this.errorsList.push("Valor deve ser maior que 0.");
      }

      if (!this.currentBill.id) {
        if (
          differenceBetweenDates(
            this.currentBill.repeatUntil,
            this.currentBill.date
          ) < 0
        ) {
          this.errorsList.push("Data de repetição inválida.");
        }
      }

      if (!this.errorsList.length) {
        /*
          Verifica se é uma atualização de uma conta
          existente, senão, é um novo cadastro
        */
        if (this.currentBill.id) {
          this.$store.dispatch("editBill");
        } else {
          this.$store.dispatch("addBill");
        }

        // Fecha o diálogo de edição
        this.dialog.edit = false;
      }
    },
  },
  watch: {
    "$store.state.dialog": {
      deep: true,
      handler(dialog) {
        if (dialog.edit) {
          const input = this.$refs.description.$refs.input;

          if (input) {
            setTimeout(() => {
              input.focus();
            }, 0);
          }
        }
      },
    },
  },
};
</script>
