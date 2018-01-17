const  express = require('express');
const  app = express();
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const IO = socketIO();
const editorSocketService = require('./services/editorSocketService')(IO);


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
//app.listen(3000, () => console.log("listen on port 3000"));
const server = http.createServer(app);
IO.attach(server);
server.listen(3000);
server.on('listening', onListening);
function onListening() {
    console.log("app listening on port 3000!");
}

