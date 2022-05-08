const express = require("express");

const { v4: uuid , validate} = require("uuid");

const app = express();

app.use(express.json());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {
    title,
    techs,
    url
  } = request.body;

  const repository= repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ "error": "Repository not found" });
  }

  if(!validate(id)){
    return response.status(400).json({
      "error":"id must be uuid"
    })
  }

  Object.assign(repository,{
    title,
    techs,
    url
  })

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

 const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories = repositories.filter(repo => repo.id != id)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository= repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.likes += 1

  return response.json({"likes":repository.likes});
});

module.exports = app;
