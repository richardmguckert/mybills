<template>
  <v-toolbar class="mb-6 py-2" elevation="3" prominent>
    <v-tooltip
      bottom
      color="indigo darken-2"
      :open-on-click="false"
      :open-on-focus="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          depressed
          elevation="3"
          fab
          large
          outlined
          v-bind="attrs"
          v-on="on"
          @click="showFilters"
        >
          <v-icon large>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <span>Filtros de pesquisa</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <v-tooltip
      bottom
      color="indigo darken-2"
      :open-on-click="false"
      :open-on-focus="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          elevation="3"
          fab
          large
          v-bind="[attrs, directives.list]"
          v-on="on"
          @click="changeExhibitionMode('list')"
        >
          <v-icon large>mdi-format-list-bulleted-square</v-icon>
        </v-btn>
      </template>
      <span>Visualização no formato de lista</span>
    </v-tooltip>

    <v-tooltip
      bottom
      color="indigo darken-2"
      :open-on-click="false"
      :open-on-focus="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ms-2"
          color="primary"
          elevation="3"
          fab
          large
          v-bind="[attrs, directives.chart]"
          v-on="on"
          @click="changeExhibitionMode('chart')"
        >
          <v-icon large>mdi-chart-bar</v-icon>
        </v-btn>
      </template>
      <span>Visualização no formato de gráfico</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <v-tooltip
      bottom
      color="indigo darken-2"
      :open-on-click="false"
      :open-on-focus="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          elevation="3"
          fab
          large
          outlined
          v-bind="attrs"
          v-on="on"
          @click="addBill"
        >
          <v-icon large>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Cadastrar nova conta</span>
    </v-tooltip>
  </v-toolbar>
</template>

<style scoped>
/* Retira o efeito hover e focus do botão */
.v-btn::before {
  display: none;
}

/* Altura da toolbar */
.v-toolbar--prominent {
  height: 90px !important;
}
</style>

<script>
import { computed } from "@/computed";

export default {
  mixins: [computed],
  methods: {
    // Função para cadastrar uma nova conta
    addBill() {
      // Povoa os campos do diálogo de edição com os valores padrões
      this.currentBill = JSON.parse(JSON.stringify(this.currentBillInit));

      // Mostra o diálogo de edição
      this.dialog.edit = true;
    },

    // Função para alterar o modo de exibição dos resultados
    changeExhibitionMode(mode) {
      this.exhibitionMode = mode;
    },

    // Função para mostrar o componente diálogo com os filtros de pesquisa
    showFilters() {
      // Povoa os campos do diálogo com os filtros de pesquisa, com os valores já salvos
      this.filtersDialog = JSON.parse(JSON.stringify(this.filters));

      // Mostra o diálogo com os filtros de pesquisa
      this.dialog.filter = true;
    },
  },
};
</script>
