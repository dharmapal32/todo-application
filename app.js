const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error:${error.message}`);
    process.exit(1);
  }
};
initializeAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      getTodoQuery = `
           SELECT
            *
           FROM
            todo 
           WHERE
            todo LIKE '%${search_q}%'
            AND status = '${status}'
            AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodoQuery = `
           SELECT
            *
           FROM
            todo 
           WHERE
            todo LIKE '%${search_q}%'
            AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodoQuery = `
               SELECT
                *
               FROM
                todo 
               WHERE
                todo LIKE '%${search_q}%'
                AND status = '${status}';`;
      break;
    default:
      getTodoQuery = `
           SELECT
            *
           FROM
            todo 
           WHERE
            todo LIKE '%${search_q}%';`;
  }

  data = await database.all(getTodoQuery);
  response.send(data);
});

module.exports = app;
