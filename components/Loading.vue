<template>
  <v-container class="fill-height primary" fluid>
    <v-row>
      <v-col class="d-flex justify-center pa-0" cols="12">
        <v-img
          eager
          lazy-src="../assets/logo.svg"
          max-width="75px"
          src="../assets/logo.svg"
          @load="transition"
        ></v-img>
      </v-col>
      <v-col class="d-flex justify-center pa-0 pt-9" cols="12">
        <h1 class="display-3 font-italic font-weight-bold white--text">
          MyBills
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from "@/computed";

export default {
  mixins: [computed],
  methods: {
    /*
      Função para fazer a transição para a página principal 
      após 2 segundos do término do carregamento do logo
    */
    transition() {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
};
</script>
