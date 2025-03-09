const express = require ('express');
const app = express();
const http = require ('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

//our vars (fixed variables)
const LISTEN_PORT = 8080; //what port is our web content is going to be served on
const ABS_STATIC_PATH = __dirname + '/public'; //this tells the serve the "root" path of web-loaded files

//set our routes
//when someone accesses this path, send something back
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: ABS_STATIC_PATH});
});

//middleware
//after someone makes a request, we do something (in the middle)
//then we send back something
app.use(express.static(ABS_STATIC_PATH)); //so files requested by client come from this root


function generateItems() {
  const primitives = ['a-box', 'a-sphere', 'a-cylinder', 'a-cone'];
  const items = [];
  // Generate a number of items for each primitive
  for (let primitive of primitives) {
    for (let i = 0; i < 5; i++) {
      // Random position within the spawn area
      const x = Math.random() * 30 + 7;
      const y = 0.7;
      const z = Math.random() * 30 - 19;
      const item = {
        primitive: primitive,
        position: `${x} ${y} ${z}`
      };
      items.push(item);
    }
  }
  return items;
}

let players = [];
// socket.io events
io.on('connection',(socket)=>{
    console.log('A user connected: ' + socket.id);
    players.push(socket.id);

    if(players.length === 1){
        io.emit('waitingForPlayer');
    } else if(players.length === 2){
        io.emit('bothPlayersConnected')
    }
    socket.on('disconnect',() =>{
        console.log(socket.id + "is disconnected");
        // create new player array without the disconnected player
        players = players.filter(player => player !== socket.id);
    });

    socket.on('waitingForPlayer', () => {
      document.getElementById('message').textContent = 'Waiting for player 2...';
    });

    socket.on('gameModeSelected', (gameMode) => {
        io.emit('startGame', gameMode);
        const items = generateItems();
        io.emit('itemsGenerated', items);
    });
    
    socket.on('itemPickedUp_s', (itemData) => {
        console.log("received itemPickedUp");
        io.emit('itemPickedUp_c', itemData);
    });

    socket.on('itemDropped_s', (itemData) => {
        io.emit('itemDropped_c', itemData);
    });

    socket.on('timerEnded', (gameMode) => {
        io.emit('gameOver', gameMode);
    });


}); 

server.listen(LISTEN_PORT); //start the server
console.log("Listening on port: " + LISTEN_PORT); //if we dont see this message, something is wrong