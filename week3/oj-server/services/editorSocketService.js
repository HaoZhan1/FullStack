const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function (io) {
    const collaborations = {};
    const socketIdtoSessionId = {};
    const sessionPath = '/temp_sessions/';

    //socketIo first Connect
    io.on('connection', (socket) => {
        //in server connect sessionId with socketIO
        const sessionId = socket.handshake.query['sessionId'];
        socketIdtoSessionId[socket.id] = sessionId;
            //if this question is recently not used, import data
        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + '/' + sessionId, data => {
            if (data) {
                collaborations[sessionId] = {
                    'cachedContents': JSON.parse(data),
                    'participants': []
                }
            } else {
                console.log('creating new sessions.');
                collaborations[sessionId] = {
                'cachedContents': [],
                'participants': []
                }
            }
            collaborations[sessionId]['participants'].push(socket.id);
            });
        }

    //register onRestoreBuffer listener fn
    //return the data to the frontEnd
        socket.on('restoreBuffer', () => {
           const sessionId = socketIdtoSessionId[socket.id];
           if (sessionId in collaborations) {
               const contents = collaborations[sessionId]['cachedContents'];
               for (let content of contents) {
                   socket.emit(content[0], content[1]);
               }
           }
        });


    //register onChange listener fn
       socket.on('change', delta => {
          const sessionId = socketIdtoSessionId[socket.id];
          if (sessionId in collaborations) {
              //addString
              collaborations[sessionId]['cachedContents'].push(['change', delta, Date.now()]);
              const participants = collaborations[sessionId]['participants'];
              //inform to other participants
              for (let participant of participants) {
                  if (socket.id != participant) {
                      console.log("socket"+ socket.id);
                      //io.to().emit()
                      io.to(participant).emit('change', delta);
                  }
              }
          } else {
              console.log('error');
          }
       });

    //register onDisconnect listener fn

        socket.on('disconnect',() => {
            const sessionId = socketIdtoSessionId[socket.id];
            let foundAndRemove = false;
            if (sessionId in collaborations) {
                const paratipants = collaborations[sessionId]['participants'];
                const index = paratipants.indexOf(socket.id);
                if (index >= 0) {
                    paratipants.slice(index, 1);
                    foundAndRemove = true;
                    //if no socket connect to the problem, delete and store to redis
                    if (paratipants.length == 0) {
                        const key = sessionPath + '/' + sessionId;
                        const value = collaborations[sessionId]['cachedContents'];
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sesssionId];
                    }
                }
            }
            if (!foundAndRemove) {
                cconsle.log('error');
            }
        });

    });
}