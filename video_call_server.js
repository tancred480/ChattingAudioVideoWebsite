var express=require("express");
const path=require("path");
var app=express();
var http=require("http").createServer(app);
var io=require("socket.io")(http);
app.use(express.static(path.join(__dirname,'public')));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"video_call.html"));
});
var users=[];
io.on("connection",(socket)=>{
       //console.log("user length is :",users);       
    console.log("UserConnected ",socket.id);
   //-------------------WHEN USER CONNECTED AUTHENTICATED--------------------
    socket.on("user_connected",(username)=>{

    var clientInfo =new Object();
    socket.on("peer_connected",(peerId)=>{
        clientInfo.customId=username;
        clientInfo.clientId=socket.id;
        clientInfo.clientPeerId=peerId;
        users.push(clientInfo);
        console.log(users);
        io.emit("active_users",users);
    });
    //---------------------
    socket.on("get_peerId",reciever=>{
        for(var i=0;i<users.length;++i){
            var c=users[i];
            if(c.customId==reciever){ //searching for the reciever to get its id from  the users array of clients. :)
                var reciever_peerId=c.clientPeerId;
                break;
            }
        }
        socket.emit("take_peerId",reciever_peerId);
    })

    console.log("User name is :"+username);
   //------------------------
    socket.on("send_message",(data)=>{
        console.log(data);
        for(var i=0;i<users.length;++i){
            var c=users[i];
            if(c.customId==data.reciever){ //searching for the reciever to get its id from  the users array of clients. :)
                var socketId=c.clientId;
                break;
            }
        }
       socket.broadcast.to(socketId).emit("new_message",data); //delivering the mssg to the reciever with its Original Id using Custom Id given by sender.
        console.log("message sent");
    });

});
    //-------------------------WHEN USER DISCONNECTED KNOWN-------------------
socket.on('disconnect',(data)=>{
    for(var i=0;i<users.length;++i){
        var c=users[i];
        if(c.clientId==socket.id){
            io.emit("user_disconnected",c.customId);
            users.splice(i,1);
            break;
        }
    } 
})
});

http.listen(3000,()=>{
    console.log("Server Started on port 3000");
});