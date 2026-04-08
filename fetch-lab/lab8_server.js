"use strict";

let messages = [
  { id: 1, text: "Welcome to the message board!", author: "Admin" },
];

let nextId = 2;

const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('public'));


// endpoints

// endpoints

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
});

// B.1

app.get('/hello', (req, res) => {
    res.type('text').send('Hello from the server!');
});

// B.2

app.get('/api/time', (req, res) => {
    let response = {
        "currentTime": new Date().toISOString(),
        "message": "Current server time"
    };
 
    res.type('json').send(response);
});

// B.3

app.get('/api/greet/:name', (req, res) => {
    let response = {
        "greeting": "Hello, " + req.params.name + "! Welcome to the API."
    };

    res.type('json').send(response);
});

// B.4

app.get('/api/math', (req, res) => {
    let result;

    let isDivideByZero = false;
    let invalidOperation = false;

    let a = parseFloat(req.query.a);
    let b = parseFloat(req.query.b);
 
    switch(req.query.operation){
        case "add":
            result = a + b;
            break;
        case "subtract":
            result = a - b;
            break;
        case "multiply":
            result = a * b;
            break;
        case "divide":
            if (req.query.b == 0){
                isDivideByZero = true;
            } else{
                result = a / b;
            }
            break;
        default:
            invalidOperation = true;
    }

    let response = {
        "a": req.query.a,
        "b": req.query.b,
        "operation": req.query.operation,
        "result": result
    };

    if (isDivideByZero){
        response = res.status(400).json({ error: "canot divide by zero"});
    } else if (invalidOperation){
        response = res.status(400).json({ error: "Invalid or missing operation. Use: add, subtract, multiply, divide" });
    }

    res.type('json').send(response);
});

// B.5

app.get('/api/slow', (req, res) => {
  setTimeout(() => {
    res.json({
      message: "Sorry for the wait!",
      delayMs: 3000
    });
  }, 3000);
});

// B.6

app.get('/api/unreliable', (req, res) => {
  const rand = Math.random();
  if (rand < 0.5) {
    res.status(500).json({
      error: "Server had a bad day. Try again!"
    });
  } else {
    res.json({
      message: "Lucky! It worked this time.",
      luckyNumber: Math.floor(Math.random() * 100)
    });
  }
});

// B.7

app.get('/api/messages', (req, res) => {
    res.type('json').send(messages);
});

app.post('/api/messages', (req, res) => {

    /**
     *     fetch('/api/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
     */
    console.log(req.body);
    let text = req.body.text;
    let author = req.body.author;
    let message;
    if (text != undefined && author != undefined){
        message = {
            id: nextId,
            text: text,
            author: author
        }
        nextId++;
        messages.push(message);
    }else{
        message = res.status(400).json({error: "Message must have a text and an author."});
    }
    res.type('json').send(message);
});

// https://dl.acm.org/doi/epdf/10.1145/3485447.3512143