const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser"); // npm install
const cors = require("cors"); // npm i cors

// Use third-party middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

// Middlewares

// checkExistByTitle = (req, res, next) => {
// // req.body.title
// }

const checkExistById = (req, res, next) => {
  let id = req.params.id;
  if (!id) {
    res.status(400).json({
      message: "Id not found",
    });
  } else {
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
      if (err) {
        res.status(500).json({
          message: err,
        });
      } else {
        let todos = JSON.parse(data);
        let todo = todos.find((e) => e.id === Number(id));
        if (todo) {
          next();
        } else {
          res.status(400).json({
            message: "Todo not exist",
          });
        }
      }
    });
  }
};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/api/v1/todos", (req, res) => {
  let perPage = Number(req.query.per_page);
  fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
    } else {
      let result = JSON.parse(data);
      if (perPage) {
        let newResult = result.splice(0, perPage);
        res.status(200).json({
          data: newResult,
        });
      } else {
        res.status(200).json({
          data: result,
        });
      }
    }
  });
});

app.get("/api/v1/todos/:id", checkExistById, (req, res) => {
  let id = req.params.id;
  fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
    let todo = JSON.parse(data).find((e) => e.id === Number(id));
    res.status(200).json(todo);
  });
});

app.post("/api/v1/todos", (req, res) => {
  console.log(req.body);
  fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
    } else {
      let todos = JSON.parse(data);
      let todo = todos.find((e) => e.title === req.body.title);
      if (todo) {
        res.status(500).json({
          message: "Todo already exists",
        });
      } else {
        let newTodo = {
          ...req.body,
          id: todos.length + 1,
          userId: Number(req.body.userId),
          completed: false,
        };
        todos.unshift(newTodo);
        fs.writeFile(
          `${__dirname}/dev-data/todos.json`,
          JSON.stringify(todos),
          () => {
            res.status(201).json({
              message: "Add todo successfully",
            });
          }
        );
      }
    }
  });
});

app.put("/api/v1/todos/:id", checkExistById, (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
    let todos = JSON.parse(data);
    let todoIndex = todos.findIndex((e) => e.id === Number(id));
    todos[todoIndex] = {
      ...todos[todoIndex],
      ...req.body,
      completed: req.body.completed,
    };
    fs.writeFile(
      `${__dirname}/dev-data/todos.json`,
      JSON.stringify(todos),
      () => {
        res.status(201).json({
          message: "Update todo successfully",
        });
      }
    );
  });
});

app.delete("/api/v1/todos/:id", checkExistById, (req, res) => {
  let id = req.params.id;
  fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
    let todos = JSON.parse(data);
    let todoIndex = todos.findIndex((e) => e.id === Number(id));
    todos.splice(todoIndex, 1);
    fs.writeFile(
      `${__dirname}/dev-data/todos.json`,
      JSON.stringify(todos),
      () => {
        res.status(201).json({
          message: "Delete todo successfully",
        });
      }
    );
  });
});

app.listen(3000, () => {
  console.log(`Example app listening on 3000`);
});
