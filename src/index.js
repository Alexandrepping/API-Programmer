const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

/**
 * Middleware
 * Interceptador de requisições que pode interromper totalmente a requisição ou
 * alterar dados da requisição
 */

const programmers = [];
/**
 * o uso do middleware = qdo quiser que um trecho de codigo seja disparado de forma automática
 * em uma ou mais rotas da nossa aplicação
 */

function validateprogrammerId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: `Param sent isn't a valida UUID` });
  }
  next();
}

app.get("/programmers", (request, response) => {
  const { name } = request.query;

  // estrutura condicional ternária
  const results = name
    ? programmers.filter((programmer) => programmer.name.includes(name))
    : programmers;

  return response.json(programmers);
});

app.post("/programmers", (request, response) => {
  const { name, surname, age, company, languages } = request.body;

  const programmer = { id: uuid(), name, surname, age, company, languages };

  programmers.push(programmer);

  return response.json(programmer);
});

app.put("/programmers/:id", validateprogrammerId, (request, response) => {
  const { id } = request.params;
  const { name, surname, age, company, languages } = request.body;

  const programmerIndex = programmers.findIndex(
    (programmer) => programmer.id === id
  );

  if (programmerIndex < 0) {
    return response.status(400).json({ error: "programmer not found." });
  }

  const programmer = {
    id,
    name,
    surname,
    age,
    company,
    languages,
  };

  programmers[programmerIndex] = programmer;

  return response.json(programmer);
});

app.delete("/programmers/:id", validateprogrammerId, (request, response) => {
  const { id } = request.params;
  const { name, surname, age, company, languages } = request.body;

  const programmerIndex = programmers.findIndex(
    (programmer) => programmer.id === id
  );

  if (programmerIndex < 0) {
    return response.status(400).json({ error: "programmer not found." });
  }
  programmers.splice(programmerIndex, 1);

  return response.status(204).send();

  /* response.json({
    message: `programador ${id} deletado`,
  });*/

  /* const programmerid = request.params.id;

  let programmer = programmers.filter((programmer) => {
    return programmer.id == programmerid;
  })[0];

  programmerIndex = programmers.indexOf(programmer);

  programmers.slice(programmerIndex, 1);

  response.json({
    message: `programador ${programmerid} deletado`,
  });*/
});

const port = 4000;
app.listen(4000, () => {
  console.log(`Server up and running on PORT ${port}`);
});
