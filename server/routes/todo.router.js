const { response } = require('express');
const express = require('express');
const { read } = require('fs');
const todoRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

// GET
// this is the /todo GET route
todoRouter.get(`/`, (req, res) => {
    console.log(`Received a GET /todo request`);
    // build the SQL query
    let queryText = `SELECT * FROM "todo" ORDER BY "id"`;

    // send the query to the SQL database
    pool
        .query(queryText)
        .then((response) => {
            // the response here is a bunch of todo
            let todo = response.rows;
            console.log(`This should be a bunch of todo:`, todo);
            // send the todo to the client
            res.send(todo);
        })
        .catch((error) => {
            console.log(`There was an error in the GET /todo route:`, error);
            // let the client know that there was an error on the server
            res.sendStatus(500);
        });
});

// POST
//adds a new task to the list of todo
//request body must be a task object with task, complete?
todoRouter.post('/', (req, res) => {
    console.log(`in post /todo`);
    let newTodo = req.body;
    console.log('Adding task', newTodo);

    let queryText = `INSERT INTO "todo" ("task", "complete")
    VALUES($1, $2);`;
    
    pool
        .query(queryText, [
            newTodo.task,
            newTodo.complete,
        ])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error adding new todo`, error);
            res.sendStatus(500);
        });
});

// PUT
todoRouter.put('/:id', (req, res) => {
    let id = req.params.id;
    let complete = req.body.complete;

    console.log(id);
    console.log(complete);

    let queryText = `
        UPDATE "todo"
        SET "complete" = $2
        WHERE "id" = $1
         `

    let values = [id, complete];

    pool.query(queryText, values).then(result => {
        res.sendStatus(204);

    }).catch(err => {
        console.log('Error with GET query', err);
        res.sendStatus(500);
    })
})

// DELETE
todoRouter.delete('/:id', (req, res) => {
    let id = req.params.id
    console.log(id);
    // pool.query...
    let queryText = `	
    DELETE FROM "todo"
  WHERE "id" = $1;
    `
    let values = [id];

    pool.query(queryText, values).then(result => {
        res.sendStatus(204);

    }).catch(err => {
        console.log('Error with GET query', err);
        res.sendStatus(500);
    })

});

module.exports = todoRouter;