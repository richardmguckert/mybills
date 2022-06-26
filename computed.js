import { formatDate } from "@/date";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

export const computed = {
  computed: {
    ...mapGetters([
      "billDateFormatted",
      "billsFiltered",
      "billRepeatUntilFormatted",
      "totalizersPerDate",
    ]),
    ...mapState(["bills", "currentBillInit", "modality"]),

    balance: {
      get() {
        return this.$store.state.balance;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "balance", value }]);
      },
    },
    currentBill: {
      get() {
        return this.$store.state.currentBill;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "currentBill", value }]);
      },
    },
    currentSituation: {
      get() {
        return this.$store.state.currentSituation;
      },
      set(value) {
        this.$store.dispatch("update", [
          { property: "currentSituation", value },
        ]);
      },
    },
    description: {
      get() {
        return this.currentBill.description;
      },
      set(value) {
        this.currentBill.description = value.toString().toUpperCase();
      },
    },
    dialog: {
      get() {
        return this.$store.state.dialog;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "dialog", value }]);
      },
    },
    directives() {
      return {
        chart: {
          dark: this.exhibitionMode === "chart" ? true : false,
          outlined: this.exhibitionMode === "chart" ? false : true,
        },
        list: {
          dark: this.exhibitionMode === "list" ? true : false,
          outlined: this.exhibitionMode === "list" ? false : true,
        },
      };
    },
    exhibitionMode: {
      get() {
        return this.$store.state.exhibitionMode;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "exhibitionMode", value }]);
      },
    },
    filters: {
      get() {
        return this.$store.state.filters;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "filters", value }]);
      },
    },
    filtersDialog: {
      get() {
        return this.$store.state.filtersDialog;
      },
      set(value) {
        this.$store.dispatch("update", [
          {
            property: "filtersDialog",
            value,
          },
        ]);
      },
    },
    /*
      Formata a data do filtro de pesquisa de acordo com a quantidade de meses selecionados:
      1 mês selecionado, formato: NOME DO MÊS/ANO COM 4 DÍGITOS
      2 meses ou mais: quantidade de meses selecionados
    */
    filterDateFormatted() {
      // Array dos meses selecionados
      const months = this.filtersDialog.dates;

      // Vários meses selecionados
      if (months.length > 1) {
        return `${months.length} meses selecionados`;
      } else {
        // Único mês selecionado
        return formatDate(months[0], "MMMM/YYYY");
      }
    },
    loading: {
      get() {
        return this.$store.state.loading;
      },
      set(value) {
        this.$store.dispatch("update", [{ property: "loading", value }]);
      },
    },
    resultLastOperation: {
      get() {
        return this.$store.state.resultLastOperation;
      },
      set(value) {
        this.$store.dispatch("update", [
          { property: "resultLastOperation", value },
        ]);
      },
    },
    situation() {
      let color = "orange darken-1";
      let text =
        this.currentBill.modality === "Despesa" ? "Não paga" : "Não recebida";

      if (this.currentBill.situation) {
        color = "primary";
        text = this.currentBill.modality === "Despesa" ? "Paga" : "Recebida";
      }

      return { color, text };
    },
    title() {
      return (
        this.currentBill.description || `Nova ${this.currentBill.modality}`
      );
    },
  },
};
