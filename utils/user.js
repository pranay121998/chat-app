var users = [];

//save user data
function userJoin(id,username,room){
    var user ={id:id,username:username,room:room};

   users.push(user);

   return user;
}

//get user data
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

//when user leave the room
function userLeave(id){
    const index = users.findIndex(user => user.id ===id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//get room users

function getRoomUsers(room){
return users.filter(user => user.room ===room)
}

module.exports={
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}