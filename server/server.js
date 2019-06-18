const express = require('express');
const cors = require('cors');
const server = express();
const port = 3001;
var getDungeon = require('./mods/getDungeon');

server.use(cors());
server.use('/assets', express.static('assets'));
server.listen(port, () => console.log(`Server up`));



server.get('/dungeon', getDungeon);
