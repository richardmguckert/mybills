<template>
  <v-card class="mb-6 py-3" color="primary" dark elevation="6" outlined shaped>
    <h4 class="pb-1 text-center">Saldo atual</h4>
    <h1 class="display-2 text-center">{{ balance | currency }}</h1>
  </v-card>
</template>

<script>
import { computed } from "@/computed";
import { currency } from "@/filters";

export default {
  mixins: [computed],
  filters: {
    currency,
  },
};
</script>
