<template>
  <div id="chartContainer">
    <LineChartGenerator
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
    />

    <v-simple-table class="mt-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Mês/ano</th>
            <th class="text-left">Receitas recebidas</th>
            <th class="text-left">Despesas pagas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(date, index) in chartData.labels" :key="index">
            <td class="text-left">{{ date }}</td>
            <td class="text-left">
              {{ chartData.datasets[0].data[index] | currency }}
              <v-icon color="primary">{{
                index > 0 &&
                chartData.datasets[0].data[index] !=
                  chartData.datasets[0].data[index - 1]
                  ? chartData.datasets[0].data[index] >
                    chartData.datasets[0].data[index - 1]
                    ? "mdi-arrow-up-bold"
                    : "mdi-arrow-down-bold"
                  : ""
              }}</v-icon>
            </td>
            <td class="text-left">
              {{ chartData.datasets[1].data[index] | currency }}
              <v-icon color="orange darken-1">{{
                index > 0 &&
                chartData.datasets[1].data[index] !=
                  chartData.datasets[1].data[index - 1]
                  ? chartData.datasets[1].data[index] >
                    chartData.datasets[1].data[index - 1]
                    ? "mdi-arrow-up-bold"
                    : "mdi-arrow-down-bold"
                  : ""
              }}</v-icon>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-right primary--text font-weight-bold">Total:</td>
            <td class="text-left primary--text font-weight-bold">
              {{ totalizer[0] | currency }}
            </td>
            <td class="text-left primary--text font-weight-bold">
              {{ totalizer[1] | currency }}
            </td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
  </div>
</template>

<style>
#chartContainer {
  margin: 0 auto;
  max-width: 960px;
  position: relative;
  width: 100%;
}
</style>

<script>
import { computed } from "@/computed";
import { currency } from "@/filters";
import { formatDate } from "@/date";
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  mixins: [computed],
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Receitas recebidas",
            backgroundColor: "#3F51B5",
            borderColor: "#3F51B5",
            data: [],
          },
          {
            label: "Despesas pagas",
            backgroundColor: "#FB8C00",
            borderColor: "#FB8C00",
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    totalizer() {
      let totalizer = [0, 0];

      totalizer[0] = Object.values(this.totalizersPerDate["Receita"]).reduce(
        (acc, current) => acc + current,
        0
      );

      totalizer[1] = Object.values(this.totalizersPerDate["Despesa"]).reduce(
        (acc, current) => acc + current,
        0
      );

      return totalizer;
    },
  },
  filters: {
    currency,
  },
  watch: {
    totalizersPerDate: {
      handler: function (totalizers) {
        this.chartData.labels = this.filters.dates.map((month) => {
          return formatDate(month, "MMMM/YYYY");
        });

        this.chartData.datasets[0].data = Object.values(totalizers["Receita"]);
        this.chartData.datasets[1].data = Object.values(totalizers["Despesa"]);
      },
      immediate: true,
    },
  },
};
</script>
