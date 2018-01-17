const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//router.fn('url', (res, req) => {
// servce.fn().then(problem => res.json(),(error) => {res.status().send()})})

router.get('/problems', (req, res) => {
    problemService.getProblems()
    .then(problems => res.json(problems));
});

router.get('/problems/:id', (req, res) => {
    const id = req.params.id;
    problemService.getProblem(+id)
    .then(problema => res.json(problema));
});

router.post('/problems', jsonParser, (req, res) => {
    problemService.addProblem(req.body)
    .then(problem => res.json(problem),
    (error) => {
        res.status(400).send("Problem name already exists");}
        )
});
module.exports = router;