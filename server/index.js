const express = require('express');
var cors = require('cors');
var Dungeon = require('dungeon-generator');

const server = express();
server.use(cors());
server.use('/assets', express.static('assets'));
const port = 3001
server.listen(port, () => console.log(`Server up`));

// server.get('/dungeon', (req, res) => {
    let rooms_max = 3;
    let shape = 5;
    let centerIndex = Math.floor(Math.pow(shape, 2) / 2);
    current_room_id = -1;
    let bp = [];
    for(let i = 0; i < Math.pow(shape, 2); i++){
        bp.push({
            nodeIndex: i,
            id: -1,
            top: -1,
            left: -1,
            bottom: -1,
            right: -1,
        });
    }
    bp.forEach(room => {
        room.top = getTop(room.nodeIndex);
        room.left = getLeft(room.nodeIndex);
        room.bottom = getBottom(room.nodeIndex);
        room.right = getRight(room.nodeIndex);
    });

    bp[centerIndex].id = 0;

    function getNode(nodeIndex){
        return bp[nodeIndex];
    }
    function getTop(nodeIndex){
        return  bp[getTopIndex(nodeIndex)];
    }
    function getLeft(nodeIndex){
        return  bp[getLeftIndex(nodeIndex)];
    }
    function getBottom(nodeIndex){
        return  bp[getBottomIndex(nodeIndex)];
    }
    function getRight(nodeIndex){
        return bp[getRightIndex(nodeIndex)];
    }
    function getTopIndex(nodeIndex){
        return  nodeIndex - shape;
    }
    function getLeftIndex(nodeIndex){
        return  nodeIndex - 1;
    }
    function getBottomIndex(nodeIndex){
        return nodeIndex + shape;
    }
    function getRightIndex(nodeIndex){
        return nodeIndex + 1;
    }

    // function getDirectionFrom(nodeIndexA, nodeIndexB){
    //     if(nodeIndexB === nodeIndexA - shape){
    //         return "top";
    //     }
    //     else if(nodeIndexB === nodeIndexA - 1){
    //         return "left";
    //     }
    //     else if(nodeIndexB === nodeIndexA + shape){
    //         return "bottom";
    //     }
    //     else if(nodeIndexB === nodeIndexA + 1){
    //         return "right";
    //     }
    // }

    function createNode(nodeIndex){
        let room =  bp[nodeIndex];
        let neighbors = [room.top, room.left, room.bottom, room.right];
        let buildables = neighbors.filter(n => {
        
            return typeof n !== "undefined" && n.id === -1;
        });
        let connectables = neighbors.filter(n => {
            return typeof n !== "undefined" && n.id !== -1;
        });
        let possible_doors = Math.min(rooms_max - current_room_id, buildables.length);
        let new_rooms = Math.floor(Math.random() * possible_doors) + 1;
        for(let i= 0; i<new_rooms; i++){
            let room = buildables.shuffle().pop();
            console.log(buildables.length);
        }
        
    }

    createNode(12);
    
// });

// dungeon.print();



