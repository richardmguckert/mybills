<template>
  <v-app>
    <v-main>
      <transition mode="out-in" name="slide-fade">
        <!-- Tela inicial de carregamento -->
        <Loading v-if="loading" />

        <!-- Tela principal -->
        <Main v-else />
      </transition>
    </v-main>
  </v-app>
</template>

<style>
/* Tempo de transição entre uma página e outra */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

/* Modo da transição e tempo para iniciar a transição */
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}

/* Alterar a opacidade da página */
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}

/* Tamanho máximo das janelas de diálogo */
.v-dialog {
  max-width: 480px !important;
}
</style>

<script>
import { computed } from "@/computed";
import Loading from "@/components/Loading";
import Main from "@/components/Main";

export default {
  name: "App",
  mixins: [computed],
  components: {
    Loading,
    Main,
  },
  beforeCreate() {
    // Altera o title da página inicial antes da criação da aplicação
    document.title = "MyBills";
  },
};
</script>
