<template>
  <v-container id="container">
    <!-- Saldo atual -->
    <Balance />

    <!-- Barra de opções: filtros, modos de visualização e opção de novo cadastro -->
    <Toolbar />

    <!-- Mensagem com o resultado da última operação realizada -->
    <MessageLastOperation />

    <!-- Mostra as contas encontradas de acordo com o filtro de pesquisa e o modo de visualização selecionado pelo usuário -->
    <transition mode="out-in" name="slide-fade" v-if="bills.length">
      <!-- Visualização no formato de lista -->
      <BillsList class="mt-4" v-if="exhibitionMode === 'list'" />

      <!-- Visualização no formato de gráfico -->
      <BillsChart class="mt-4" v-else-if="exhibitionMode === 'chart'" />
    </transition>

    <!-- Nenhum registro encontrado -->
    <v-alert
      v-else
      border="left"
      color="indigo"
      colored-border
      elevation="3"
      icon="mdi-filter-remove-outline"
      prominent
    >
      Nenhum registro encontrado.
    </v-alert>

    <!-- Diálogo com os filtros de pesquisa -->
    <FiltersDialog />

    <!-- Diálogo para cadastro/alteração de uma conta -->
    <EditDialog />

    <!-- Diálogo para exclusão de uma conta -->
    <DeleteDialog />
  </v-container>
</template>

<style scoped>
/* Tamanho máximo do container da aplicação */
.container {
  max-width: 960px !important;
}
</style>

<script>
import { computed } from "@/computed";
import Balance from "@/components/Balance";
import BillsChart from "@/components/BillsChart";
import BillsList from "@/components/BillsList";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import EditDialog from "@/components/dialog/EditDialog";
import FiltersDialog from "@/components/dialog/FiltersDialog";
import MessageLastOperation from "@/components/MessageLastOperation";
import Toolbar from "@/components/Toolbar";

export default {
  mixins: [computed],
  components: {
    Balance,
    BillsChart,
    BillsList,
    DeleteDialog,
    EditDialog,
    FiltersDialog,
    MessageLastOperation,
    Toolbar,
  },
  mounted() {
    // Ao carregar a página, busca o saldo atual e as contas do mês atual
    this.$store.dispatch("fetchBalance");
    this.$store.dispatch("fetchBills");
  },
};
</script>
