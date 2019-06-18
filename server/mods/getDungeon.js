const _ = require('lodash');
module.exports = function(req, res){

  let rooms_max = 8;
  let shape = 7;
  let centerIndex = Math.floor(Math.pow(shape, 2) / 2);
  current_room_id = 0;
  let bp = [];

  for(let i = 0; i < Math.pow(shape, 2); i++){
      bp.push({
          nodeIndex: i,
          id: -1,
          top: -1,
          left: -1,
          bottom: -1,
          right: -1,
          connections: {
            top: -1,
            left: -1,
            bottom: -1,
            right: -1
          }
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

  function getDirectionFrom(nodeIndexA, nodeIndexB){
      if(nodeIndexB === nodeIndexA - shape){
          return "top";
      }
      else if(nodeIndexB === nodeIndexA - 1){
          return "left";
      }
      else if(nodeIndexB === nodeIndexA + shape){
          return "bottom";
      }
      else if(nodeIndexB === nodeIndexA + 1){
          return "right";
      }
  }
  function shuffle(a){
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }


  function createNode(nodeIndex){

      if(current_room_id <= rooms_max){
        let room =  bp[nodeIndex];
        let neighbors = [room.top, room.left, room.bottom, room.right];
        let buildables = neighbors.filter(n => {
            return typeof n !== "undefined" && n.id === -1;
        });
        let connectables = neighbors.filter(n => {
            return typeof n !== "undefined" && n.id !== -1;
        });

        let possible_doors = Math.min(rooms_max - current_room_id, buildables.length);
        let number_of_new_rooms = current_room_id === 0 ? 4: Math.floor(Math.random() * possible_doors) + 1;
        let expanded_NodeIndices = [];
        for(let i= 0; i<number_of_new_rooms; i++){
            current_room_id++;
            shuffle(buildables);
            let new_room = buildables.pop();
            new_room.id = current_room_id;
            room.connections[getDirectionFrom(nodeIndex, new_room.nodeIndex)] = new_room.id;
            new_room.connections[getDirectionFrom(new_room.nodeIndex, nodeIndex)] = room.id;
            expanded_NodeIndices.push(new_room.nodeIndex);
        }
        shuffle(expanded_NodeIndices);
        expanded_NodeIndices.forEach(exp_nodeIndex => {
          createNode(exp_nodeIndex);
        });
      }
  }

  function make_map(print){

    let rooms = [];

    createNode(centerIndex);

    let string = "";

    bp.forEach(node => {
      string+=node.id+"\t";
      let doors = [];
      if(typeof node.top !== "undefined" && node.top.id > -1){
        doors.push("TOP-"+node.top.id);
      }
      if(typeof node.left !== "undefined" && node.left.id > -1){
        doors.push("LEFT-"+node.left.id);
      }
      if(typeof node.bottom !== "undefined" && node.bottom.id > -1){
        doors.push("BOTTOM-"+node.bottom.id);
      }
      if(typeof node.right !== "undefined" && node.right.id > -1){
        doors.push("RIGHT-"+node.right.id);
      }

      if(node.id > -1){
        rooms.push({
          id: node.id,
          nodeIndex: node.nodeIndex,
          connections: doors,
          locked: node.id!=0,
          width: 10,
          height: 10,
          enemies: node.id!=0 ? ["slime","slime","slime"] : []
        });
      }

      if((node.nodeIndex+1)%shape===0){
        string+="\n";
      }

    });
    rooms = _.orderBy(rooms, 'id', 'asc');
    if(print){
      console.log(string);
    }
    return  {
       shape: shape,
       room_count: rooms.length,
       rooms: rooms
     }
  }

  let result = make_map(true);
  res.send(result);
}
