const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pd_db'
});

// connect to database
mc.connect();

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// Retrieve all todos
app.get('/Test_Sessions', function (req, res) {
    mc.query('SELECT * FROM Test_Session', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Test_Session' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/todos/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM tasks WHERE task LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos search list.' });
    });
});

// Retrieve todo with id
app.get('/todo/:id', function (req, res) {

    let task_id = req.params.id;

    mc.query('SELECT * FROM tasks where id=?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Todos list.' });
    });
    // Retrieve todo with id
app.get('/todo/:id', function (req, res) {

    let task_id = req.params.id;

    mc.query('SELECT * FROM tasks where id=?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Todos list.' });
    });

});

// Add a new todo
app.post('/todo', function (req, res) {

    let task = req.body.task;

    if (!task) {
        return res.status(400).send({ error:true, message: 'Please provide task' });
    }

    mc.query("INSERT INTO tasks SET ? ", { task: task }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New task has been created successfully.' });
    });
});

//  Update todo with id
app.put('/todo', function (req, res) {

    let task_id = req.body.task_id;
    let task = req.body.task;

    if (!task_id || !task) {
        return res.status(400).send({ error: task, message: 'Please provide task and task_id' });
    }

    mc.query("UPDATE tasks SET task = ? WHERE id = ?", [task, task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
            });
});

//  Delete todo
app.delete('/todo/:id', function (req, res) {

    let task_id = req.params.id;

    mc.query('DELETE FROM tasks WHERE id = ?', [task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });

});

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send('page not found');
    next();
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(80, function () {
    console.log('Node app is running on port 8080');
});

// allows "grunt dev" to create a development server with livereload
module.exports = app;