const problems = [
    {
        id: 1,
        name: 'Two Sum',
        desc: 'Given an array',
        difficulty: 'easy'
    },
    {
        id: 2,
        name: 'Three Sum',
        desc: 'Given an array',
        difficulty: 'medium'
    },
    {
        id: 3,
        name: 'Four Sum',
        desc: 'Given an array',
        difficulty: 'hard'
    },
    {
        id: 4,
        name: 'Five Sum',
        desc: 'Given an array',
        difficulty: 'super'
    },
]
//const fn = function() {
// return new Promise((resolve, reject) => {
// if() { resolve() } else {reject()}
// )}

const getProblems = function () {
    return new Promise((resolve, reject) => {
       resolve(problems);
    });
}

const getProblem = function (id) {
    return new Promise((resolve, reject) => {
       resolve(problems.find(problem => problem.id === id));
    });
}

const addProblem = function (newProblem) {
    return new Promise((resolve, reject) => {
        if (problems.find(problem => problem.name === newProblem.name)) {
            reject("Problem");
        } else {
            newProblem.id = problems.length + 1;
            problems.push(newProblem);
            resolve(newProblem);
        }
    });
}
module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
};

