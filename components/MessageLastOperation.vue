<template>
  <div>
    <v-overlay :value="resultLastOperation.show"></v-overlay>
    <v-snackbar
      content-class="d-flex justify-sm-center align-center"
      :color="resultLastOperation.color"
      timeout="2000"
      top
      v-model="resultLastOperation.show"
    >
      <h2>
        <v-icon large color="white" class="mr-2">
          {{ resultLastOperation.icon }}
        </v-icon>
        {{ resultLastOperation.text }}
      </h2>
    </v-snackbar>
  </div>
</template>

<script>
import { computed } from "@/computed";

export default {
  mixins: [computed],
};
</script>
