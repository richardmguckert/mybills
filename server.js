const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

  next();
});

app.use(express.json());
app.use(cors());

// Cria uma conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bill",
});

// Conecta no banco de dados MySQL
connection.connect((err) => {
  if (err) throw err;
});

// Busca o saldo atual
app.get("/balance/fetch", (request, response) => {
  const sql = `SELECT value
               FROM balance`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    response.json({ error: false, result });
  });
});

// Atualiza o saldo atual
app.put("/balance/", (request, response) => {
  const { balance } = request.body;

  const sql = `UPDATE balance SET value = '${balance}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    response.json({
      error: false,
    });
  });
});

// Busca as contas de acordo com os meses selecionados
app.get("/bills/fetch", (request, response) => {
  const dates = Array.from(JSON.parse(request.query.dates));

  let sql = ``;

  if (dates.length > 0) {
    dates.forEach((date, index) => {
      // Filtro por mês/ano
      if (date) {
        if (index > 0) {
          sql += `UNION `;
        }

      sql += `SELECT * 
              FROM bill 
              WHERE id > 0
              AND YEAR(DATE) = '${Number(date.split("-")[0])}'
              AND MONTH(DATE) = '${Number(date.split("-")[1])}' `;
      }
    });

    sql += `ORDER BY date, description`;
  }

  if (sql) {
    connection.query(sql, (err, result) => {
      if (err) throw err;
      response.json({ error: false, result });
    });
  } else {
    response.json({
      error: true,
    });
  }
});

// Insere uma nova conta
app.post("/bill/", (request, response) => {
  let { date, description, modality, repeatUntil, value, situation } =
    request.body;

  date = moment(date, "YYYY-MM-DD");
  repeatUntil = moment(repeatUntil, "YYYY-MM-DD");
  const diff = repeatUntil.diff(date, "months");

  let sql = ``;

  for (let i = 0; i <= diff; i++) {
    if (i == 0) {
      sql += `INSERT INTO bill (description, modality, value, date, situation) VALUES `;
    }

    let next_date = moment(date).add(i, "months").format("YYYY-MM-DD");

    sql += `('${description}', '${modality}', ${value}, '${next_date}', ${Number(
      situation
    )})`;

    if (i < diff) {
      sql += `, `;
    }
  }

  if (sql) {
    connection.query(sql, (err, result) => {
      if (err) throw err;
      response.json({
        error: false,
      });
    });
  } else {
    response.json({
      error: true,
    });
  }
});

// Atualiza os dados de uma conta
app.put("/bill/", (request, response) => {
  let { date, description, id, modality, value, situation } = request.body;

  date = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  situation = Number(situation);

  let sql = `SELECT id FROM bill WHERE id = '${id}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length) {
      let sql = `UPDATE bill 
                 SET description = '${description}', modality = '${modality}',
                     value = '${value}', date = '${date}', situation = '${situation}'
                 WHERE id = '${id}'`;

      connection.query(sql, [request.body, request.params], (err) => {
        if (err) throw err;
        response.json({
          error: false,
        });
      });
    } else {
      response.json({
        error: true,
      });
    }
  });
});

// Exclui uma conta
app.delete("/bill/:id", (request, response) => {
  let id = request.params.id;

  let sql = `SELECT id FROM bill WHERE id = '${id}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length) {
      let sql = `DELETE FROM bill WHERE id = ${id}`;

      connection.query(sql, (err, result) => {
        if (err) throw err;
        response.json({
          error: false,
        });
      });
    } else {
      response.json({
        error: true,
      });
    }
  });
});

// Escuta a porta 3000
app.listen("3000");
