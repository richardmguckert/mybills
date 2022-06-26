<template>
  <v-row justify="center">
    <v-dialog eager v-model="dialog.delete">
      <v-card>
        <v-card-title
          class="subheading primary--text font-weight-bold px-4 py-3"
        >
          Confirmação de exclusão
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-6">
          <h3>
            Deseja realmente excluir a conta:
            <span class="font-weight-bold primary--text">{{
              currentBill.description
            }}</span
            >?
          </h3>
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
                Não
              </v-btn>
              <v-btn color="primary" dark large @click="confirmDelete">
                Sim
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { computed } from "@/computed";

export default {
  mixins: [computed],
  methods: {
    // Função para cancelar a exclusão da conta
    cancel() {
      // Fecha o diálogo de exclusão
      this.dialog.delete = false;

      // Reseta a conta atual selecionada
      setTimeout(() => {
        this.currentBill = "";
      }, 100);
    },
    // Função para excluir a conta
    confirmDelete() {
      // Dispara a ação de exclusão
      this.$store.dispatch("deleteBill");

      // Fecha o diálogo de exclusão
      this.dialog.delete = false;
    },
  },
};
</script>
