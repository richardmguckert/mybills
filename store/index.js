import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { formatDate } from "@/date";

// Informa para o Vue usar o plugin Vuex
Vue.use(Vuex);

// Estado inicial de uma conta selecionada
const currentBillInit = {
  date: format(parseISO(new Date().toISOString()), "yyyy-MM-dd"),
  description: "",
  modality: "Despesa",
  repeatUntil: format(parseISO(new Date().toISOString()), "yyyy-MM"),
  value: 0,
  situation: false, // Não paga / Não recebida
};

// Estado inicial dos filtros de pesquisa
const filtersInit = {
  dates: [format(parseISO(new Date().toISOString()), "yyyy-MM")],
  description: "",
  modality: "Todas",
  situation: "Todas",
};

// Configurações do axios
const instance = axios.create({
  baseURL: "http://localhost",
});

// Caminho para as API's
const apiPath = "http://localhost";

export default new Vuex.Store({
  state: {
    balance: 0,
    bills: [],
    currentBill: {},
    currentBillInit,
    currentSituation: false,
    dialog: {
      filter: false,
      filterDate: false,
      edit: false,
      editDate: false,
      editRepeatUntil: false,
      delete: false,
    },
    exhibitionMode: "list",
    filters: filtersInit,
    filtersDialog: filtersInit,
    loading: true,
    modality: ["Despesa", "Receita"],
    resultLastOperation: {
      color: "",
      icon: "",
      show: false,
      text: "",
    },
  },
  getters: {
    // Formata a data para o padrão: Dia com 2 dígitos / Mês com 2 dígitos / Ano com 4 dígitos,
    billDateFormatted(state) {
      return formatDate(state.currentBill.date, "DD/MM/YYYY");
    },

    // Filtra as contas de acordo com os filtros de pesquisa
    billsFiltered(state) {
      let billsFiltered = state.bills;

      // Filtro por descrição
      if (state.filters.description) {
        billsFiltered = billsFiltered.filter((bill) => {
          return bill.description
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .includes(state.filters.description.toUpperCase());
        });
      }

      // Filtro por modalidade
      if (state.filters.modality !== "Todas") {
        billsFiltered = billsFiltered.filter((bill) => {
          return bill.modality === state.filters.modality;
        });
      }

      // Filtro por situação
      if (state.filters.situation !== "Todas") {
        billsFiltered = billsFiltered.filter((bill) => {
          return bill.situation === state.filters.situation;
        });
      }

      return billsFiltered;
    },

    // Formata a data para o padrão: Nome do mês / Ano com 4 dígitos,
    billRepeatUntilFormatted(state) {
      return formatDate(state.currentBill.repeatUntil, "MMMM/YYYY");
    },

    // Agrupa os valores das contas recebidas/pagas por mês/ano
    totalizersPerDate(state, getters) {
      let datesByPositions = {};
      let totalizers = {};

      // Percorre as modalidades e inicializa um objeto para cada modalidade
      state.modality.forEach((modality) => {
        totalizers[modality] = {};

        // Percorre as datas que foram selecionadas no filtro, inicializando os totalizadores para cada data
        state.filters.dates.forEach((date, key) => {
          datesByPositions[date] = key;
          totalizers[modality][key] = 0;
        });
      });

      // Percorre as contas de acordo com os filtros de pesquisa
      getters.billsFiltered.forEach((bill) => {
        // Verifica se a conta foi paga/recebida
        if (bill.situation) {
          // Soma o valor da conta no mês de vencimento da mesma
          totalizers[bill.modality][
            datesByPositions[formatDate(bill.date, "YYYY-MM")]
          ] += bill.value;
        }
      });

      return totalizers;
    },
  },
  mutations: {
    mutate(state, payload) {
      payload.forEach((obj) => {
        state[obj.property] = obj.value;
      });
    },
  },
  actions: {
    // Função para cadastrar uma nova conta - OK
    async addBill({ state }) {
      let formData = new FormData();
      formData.append("date", state.currentBill.date);
      formData.append("description", state.currentBill.description);
      formData.append("modality", state.currentBill.modality);
      formData.append("repeatUntil", state.currentBill.repeatUntil);
      formData.append("value", state.currentBill.value);
      formData.append("situation", Number(state.currentBill.situation));

      await instance
        .post(`${apiPath}/bills.php?action=create`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 200) {
            // Se a conta foi marcada como paga ou recebida
            if (state.currentBill.situation) {
              // Verifica a modalidade da conta para calcular o novo saldo atual
              const newBalance =
                Number(state.balance) +
                Number(state.currentBill.value) *
                  (state.currentBill.modality === "Despesa" ? -1 : 1);

              // Atualiza o saldo atual
              this.dispatch("update", [
                {
                  property: "balance",
                  value: newBalance,
                },
              ]);

              this.dispatch("editBalance", newBalance);
            }

            // Busca as contas do usuário de acordo com a data informada no filtro na opção "filtrar por mês/ano"
            this.dispatch("fetchBills");

            // Mostra a mensagem de sucesso
            this.dispatch("showMessage", "success");
          } else {
            // Mostra a mensagem de erro
            this.dispatch("showMessage", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para excluir uma conta - OK
    async deleteBill({ state }) {
      let formData = new FormData();
      formData.append("id", state.currentBill.id);

      await instance
        .post(`${apiPath}/bills.php?action=delete`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 200) {
            // Se a conta foi marcada como paga ou recebida
            if (state.currentBill.situation) {
              // Verifica a modalidade da conta para calcular o novo saldo atual
              const newBalance =
                Number(state.balance) +
                Number(state.currentBill.value) *
                  (state.currentBill.modality === "Despesa" ? 1 : -1);

              // Atualiza o saldo atual
              this.dispatch("update", [
                {
                  property: "balance",
                  value: newBalance,
                },
              ]);

              this.dispatch("editBalance", newBalance);
            }

            // Busca as contas do usuário de acordo com a data informada no filtro na opção "filtrar por mês/ano"
            this.dispatch("fetchBills");

            // Mostra a mensagem de sucesso
            this.dispatch("showMessage", "success");
          } else {
            // Mostra a mensagem de erro
            this.dispatch("showMessage", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para editar o saldo atual - OK
    async editBalance(state, newBalance) {
      let formData = new FormData();
      formData.append("value", newBalance);

      await instance
        .post(`${apiPath}/balance.php?action=update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para editar uma nova conta
    async editBill({ state }) {
      let formData = new FormData();
      formData.append("id", state.currentBill.id);
      formData.append("date", state.currentBill.date);
      formData.append("description", state.currentBill.description);
      formData.append("modality", state.currentBill.modality);
      formData.append("value", state.currentBill.value);
      formData.append("situation", Number(state.currentBill.situation));

      await instance
        .post(`${apiPath}/bills.php?action=update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.status === 200) {
            // Houve mudança na situação da conta
            if (state.currentBill.situation != state.currentSituation) {
              // Calcula o novo saldo
              let newBalance = state.balance;

              // Se a conta foi marcada como paga ou recebida
              if (state.currentBill.situation) {
                newBalance +=
                  state.currentBill.value *
                  (state.currentBill.modality === "Despesa" ? -1 : 1);
              } else {
                newBalance +=
                  state.currentBill.value *
                  (state.currentBill.modality === "Despesa" ? 1 : -1);
              }

              // Verifica a modalidade da conta para calcular o novo saldo atual
              this.dispatch("update", [
                {
                  property: "balance",
                  value: newBalance,
                },
              ]);

              this.dispatch("editBalance", newBalance);
            }

            // Busca as contas do usuário de acordo com a data informada no filtro na opção "filtrar por mês/ano"
            this.dispatch("fetchBills");

            // Mostra a mensagem de sucesso
            this.dispatch("showMessage", "success");
          } else {
            // Mostra a mensagem de erro
            this.dispatch("showMessage", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para buscar o saldo atual - OK
    async fetchBalance({ state }) {
      await instance
        .get(`${apiPath}/balance.php`)
        .then((response) => {
          if (response.status === 200) {
            this.dispatch("update", [
              {
                property: "balance",
                value: response.data,
              },
            ]);
          } else {
            // Mostra a mensagem de erro
            this.dispatch("showMessage", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para buscar as contas do usuário de acordo com a data informada no filtro na opção "filtrar por mês/ano" - OK
    async fetchBills({ state }) {
      await instance
        .get(`${apiPath}/bills.php`, {
          params: {
            dates: JSON.stringify(state.filters.dates),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.dispatch("update", [
              {
                property: "bills",
                value: response.data,
              },
            ]);
          } else {
            // Mostra a mensagem de erro
            this.dispatch("showMessage", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Função para mostrar uma mensagem de retorno após a realização da última operação
    showMessage({ state }, type) {
      this.dispatch("update", [
        {
          property: "resultLastOperation",
          value: {
            color: type,
            icon: type === "success" ? "mdi-check-circle" : "mdi-alert-circle",
            show: true,
            text: type === "success" ? "Sucesso!" : "Erro!",
          },
        },
      ]);
    },

    // Função para registrar qualquer alteração nos dados da aplicação
    update({ commit }, payload) {
      commit("mutate", payload);
    },
  },
});
