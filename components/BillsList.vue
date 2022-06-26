<template>
  <v-data-table
    :headers="headers"
    :items="billsFiltered"
    :items-per-page="15"
    class="elevation-3"
    multi-sort
  >
    <template v-slot:item.date="{ item }">
      {{ formatDate(item.date, "DD/MM/YYYY") }}
    </template>

    <template v-slot:item.value="{ item }">
      {{ item.value | currency }}
    </template>

    <template v-slot:item.modality="{ item }">
      <v-icon
        class="mr-1"
        :color="item.modality === 'Receita' ? 'primary' : 'orange darken-1'"
        >{{
          item.modality === "Receita"
            ? "mdi-plus-circle-outline"
            : "mdi-minus-circle-outline"
        }}</v-icon
      >{{ item.modality }}
    </template>

    <template v-slot:item.situation="{ item }">
      <v-chip
        class="justify-center"
        :color="Number(item.situation) ? 'primary' : 'orange darken-1'"
        dark
        small
      >
        {{
          Number(item.situation)
            ? item.modality === "Receita"
              ? "Recebida"
              : "Paga"
            : item.modality === "Receita"
            ? "Não recebida"
            : "Não paga"
        }}
      </v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="mr-2"
        color="primary"
        fab
        dark
        outlined
        small
        @click="editBill(item)"
      >
        <v-icon dark> mdi-pencil </v-icon>
      </v-btn>
      <v-btn
        class="mr-2"
        color="primary"
        fab
        dark
        outlined
        small
        @click="deleteBill(item)"
      >
        <v-icon dark> mdi-delete </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<style>
.v-chip {
  width: 110px !important;
}

.v-data-table tbody tr:nth-child(odd) {
  background-color: #f5f5f5;
}
</style>

<script>
import { computed } from "@/computed";
import { currency } from "@/filters";
import { formatDate } from "@/date";

export default {
  data() {
    return {
      headers: [
        {
          text: "Descrição",
          sortable: true,
          value: "description",
        },
        {
          text: "Vencimento",
          sortable: true,
          value: "date",
          width: "130px",
        },
        {
          text: "Valor",
          sortable: true,
          value: "value",
          width: "130px",
        },
        {
          text: "Modalidade",
          sortable: true,
          value: "modality",
          width: "130px",
        },
        {
          text: "Situação",
          sortable: true,
          value: "situation",
          width: "130px",
        },
        {
          text: "Ações",
          sortable: false,
          value: "actions",
          width: "130px",
        },
      ],
    };
  },
  filters: {
    currency,
  },
  mixins: [computed],
  methods: {
    // Função para formatar uma data de acordo com um padrão passado por parâmetro
    formatDate,

    // Função para excluir a conta que o usuário clicou
    deleteBill(bill) {
      // Povoa a variável de conta selecionada com os dados da conta que o usuário clicou
      this.currentBill = JSON.parse(JSON.stringify(bill));

      // Abre o diálogo de excluir
      this.dialog.delete = true;
    },

    // Função para editar a conta que o usuário clicou
    editBill(bill) {
      // Povoa a variável de conta selecionada com os dados da conta que o usuário clicou
      this.currentBill = JSON.parse(JSON.stringify(bill));

      // Situação atual da conta selecionada
      this.currentSituation = this.currentBill.situation = Boolean(
        Number(bill.situation)
      );

      // Abre o diálogo de edição
      this.dialog.edit = true;
    },
  },
};
</script>
