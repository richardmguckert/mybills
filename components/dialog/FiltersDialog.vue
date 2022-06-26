<template>
  <v-row justify="center">
    <v-dialog eager v-model="dialog.filter">
      <v-card>
        <v-card-title
          class="subheading primary--text font-weight-bold px-4 py-3"
        >
          Filtros de pesquisa
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-4">
          <!-- Filtro por mês/ano -->
          <v-row class="mt-2">
            <v-col class="text-center" cols="12">
              <v-dialog v-model="dialog.filterDate">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    append-icon="mdi-calendar"
                    autofocus
                    color="primary"
                    hide-details
                    label="Mês/ano"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :value="filterDateFormatted"
                    @click:clear="filtersDialog.dates = []"
                  ></v-text-field>
                </template>

                <v-date-picker
                  color="primary"
                  multiple
                  scrollable
                  type="month"
                  v-model="filtersDialog.dates"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mb-3 mr-2"
                    color="primary"
                    large
                    outlined
                    @click="dialog.filterDate = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    class="mb-3"
                    color="primary"
                    dark
                    large
                    @click="dialog.filterDate = false"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <!-- /Filtro por mês/ano -->

          <!-- Filtro por descrição -->
          <v-row class="mt-2">
            <v-col class="text-center" cols="12">
              <v-text-field
                append-icon="mdi-pencil"
                hide-details
                label="Descrição"
                outlined
                v-model="filtersDialog.description"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- /Filtro por descrição -->

          <v-row class="mt-2">
            <!-- Filtro por modalidade -->
            <v-col class="text-center" cols="6">
              <v-select
                append-icon="mdi-plus-minus-variant"
                color="primary"
                hide-details
                label="Modalidade"
                outlined
                :items="modalities"
                v-model="filtersDialog.modality"
              ></v-select>
            </v-col>
            <!-- /Filtro por modalidade -->

            <!-- Filtro pelo situação -->
            <v-col class="text-center" cols="6">
              <v-select
                append-icon="mdi-check"
                color="primary"
                hide-details
                label="Situação"
                outlined
                :items="situations"
                v-model="filtersDialog.situation"
              ></v-select>
            </v-col>
            <!-- /Filtro pelo situação -->
          </v-row>

          <!-- Alerta para nenhum mês/ano informado no filtro de pesquisa -->
          <v-alert
            type="warning"
            border="left"
            class="mt-4"
            icon="mdi-alert"
            outlined
            prominent
            v-show="!filtersDialog.dates.length"
            >Favor informar pelo menos 1 mês/ano no filtro de pesquisa.
          </v-alert>
          <!-- /Alerta para nenhum mês/ano informado no filtro de pesquisa -->

          <!-- Botões -->
          <v-row class="mt-2">
            <v-col class="d-flex justify-end align-center" cols="12">
              <v-btn
                class="mr-2"
                color="primary"
                large
                outlined
                @click="cancelFilters()"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                dark
                large
                @click="confirmFilters()"
                v-show="Boolean(filtersDialog.dates.length)"
                >Confirmar</v-btn
              >
            </v-col>
          </v-row>
          <!-- /Botões -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style>
/* Coloca o mês selecionada com a primeira letra em maiúsculo */
.v-picker__title__btn div:first-letter {
  text-transform: uppercase !important;
}
</style>

<script>
import { computed } from "@/computed";

export default {
  data() {
    return {
      modalities: ["Todas", "Despesa", "Receita"],
      situations: ["Todas", "Não paga/Não recebida", "Paga/recebida"],
    };
  },
  mixins: [computed],
  methods: {
    // Função para cancelar e fechar o componente de diálogo com os filtros de pesquisa
    cancelFilters() {
      this.dialog.filter = false;
    },
    // Função para confirmar os filtros que o usuário informou nos filtros de pesquisa
    confirmFilters() {
      /*
        Verifica se houve mudança de datas no filtro de pesquisa, para então, disparar a ação para 
        buscar as contas do usuário de acordo com a opção "filtrar por mês/ano"
      */
      this.filters.dates.sort();
      this.filtersDialog.dates.sort();

      let datesChanged = false;

      if (
        JSON.stringify(this.filters.dates) !==
        JSON.stringify(this.filtersDialog.dates)
      ) {
        datesChanged = true;
      }

      // Armazena os valores informados no diálogo com os filtros de pesquisa
      this.filters = JSON.parse(JSON.stringify(this.filtersDialog));

      /*
        Se houve mudança de datas no filtro de pesquisa, 
        dispara a ação para buscar as contas de acordo com as datas selecionadas
      */
      if (datesChanged) {
        this.$store.dispatch("fetchBills");
      }

      // Oculta o diálogo com os filtros de pesquisa
      this.dialog.filter = false;
    },
  },
};
</script>
