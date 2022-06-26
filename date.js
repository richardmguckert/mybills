import moment from "moment";

// Função para verificar a diferença entre 2 datas
export function differenceBetweenDates(date1, date2) {
  const year1 = Number(date1.split("-")[0]);
  const month1 = Number(date1.split("-")[1]) - 1;

  const year2 = Number(date2.split("-")[0]);
  const month2 = Number(date2.split("-")[1]) - 1;

  return moment([year1, month1, 1]).diff(moment([year2, month2, 1]), "days");
}

/*
  Função para formatar uma data de acordo com um 
  padrão de formatação passado por parâmetro
*/
export function formatDate(date, formatString = "DD/MM/YYYY") {
  if (formatString === "MMMM/YYYY") {
    moment.locale("pt-br");

    const month = moment(date)
      .format("MMMM")
      .replace(/^\w/, (c) => c.toUpperCase());

    const year = moment(date).format("YYYY");

    return date ? `${month}/${year}` : "";
  } else {
    return date ? moment(date).format(formatString) : "";
  }
}
