const  express = require('express');
const  app = express();
const path = require('path');

const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds157097.mlab.com:57097/oj-server');

const restRouter = require('./routes/rest');
const indexRouter = require('./routes/index');

//app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1', restRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, '../public/')));
app.use((req, res) => {
   res.sendFile('index.html', {root: path.join(__dirname, '../public')})
});
app.listen(3000, () => console.log("listen on port 3000"));


