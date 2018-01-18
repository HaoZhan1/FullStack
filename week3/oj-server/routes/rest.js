const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

//router.fn('url', (res, req) => {
// servce.fn().then(problem => res.json(),(error) => {res.status().send()})})

EXECUTOR_SERVER_URL = 'http://executor/result';
//registerMethod
restClient.registerMethod('result', EXECUTOR_SERVER_URL, 'POST');


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
router.post('/result', jsonParser, (req, res) => {
   const usercode = req.body.userCodes;
   const language = req.body.language;
   console.log({'text': 'hello from nodejs'});
    restClient.methods.result(
        {
            data: {usercode: usercode, language: language},
            headers: {'Content-Type': 'application/json'}
        },
        (data, response) => {
            const zzz = `Build output: ${data['build']}, Execute output: ${data['run']}`;
         //   console.log(data['build'] + "text----------");
            data['text'] = zzz;
            console.log(data['text']);
            res.json(data);
        }
    );
});


module.exports = router;