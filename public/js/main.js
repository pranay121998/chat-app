// const { query } = require("express");

const chatForm=document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')

const socket = io();

const queryString = window.location.search;
 var urlsparms= new URLSearchParams(queryString)//new URL(window.location.href).searchParams;
 console.log(urlsparms.get('username'));
const username =urlsparms.get('username');
const room=urlsparms.get('room');
     
 
//when user join room
 socket.emit('joinRoom',{username,room});

 //get users and room info
 socket.on('roomUsers',({users,room})=>{
     outputRoomName(room);
     outputUsers(users)
 })

//message from server
socket.on('message', message=>{
    outputMessage(message)

    //scorll down
    chatMessage.scrollTop=chatMessage.scrollHeight;
})


//messages submit
chatForm.addEventListener('submit',e=>{
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    //emit messages to server
    socket.emit('chatMessage',msg);
    
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    
});

//output messages to DOM
function outputMessage(message){
    console.log(message)
const div = document.createElement('div');
div.classList.add('message');

div.innerHTML=`<p class="meta">${message.username}<span> ${ message.time}</span></p>
<p class="text">
    ${message.text}
</p>`

document.querySelector('.chat-messages').append(div)
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerHTML=room;
}

//Add users to DOM
function outputUsers(users){
 
    userList.innerHTML =`
   ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `

}
//${users.map(user=> `<li>${user.username}</li>`).join('')}