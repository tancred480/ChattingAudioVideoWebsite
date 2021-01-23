var io=io("http://localhost:3000");
const myPeer=new Peer(undefined,{
    host:"/",
    port:"443"
});

    var act_users=[]
    const peers={}
    var uname="";
    uname=prompt("Enter your name");
    uname+="";
    io.emit("user_connected",uname);
    myPeer.on("open",(id)=>{
        io.emit("peer_connected",id);
        
    });
    var sender="";
    sender=uname;
    var reciever="";
    
    io.on("active_users",users=>{
        for (var i=0;i<users.length;++i){
            var c=users[i];
            if(c.customId!=sender){
                if(!act_users.includes(c.customId)){ //it cheks if the user exist in the array if exists then it true else false.
                var html="";
                html+="<li id="+c.customId+" class=\"d-flex list-group-item mt-1\"><button class=\"rounded-circle bg-dark  mr-1\"><i class=\"fas fa-user text-light\" style=\"font-size: 22px;\"></i></button><button  onclick='onUserSelected(this.innerHTML);'>"+c.customId+"</button></li>";
                document.getElementById("ulist").innerHTML+=html;
                act_users.push(c.customId);
                console.log(act_users)
                }
            }
        }
    });
    
    io.on("user_disconnected",data=>{
        console.log("User Disconnected ",data);
        document.getElementById(data).remove();
        for(var i=0;i<act_users.length;++i){
            var c=act_users[i]
            if(data==c){
                act_users.splice(i,1);
                break;
            }
        }
        console.log("Now active Users remaining are :",act_users);
    });

    io.on("new_message",function(data){
        var html="";
        html+=`<p id="sender" class="d-flex justify-content-start"><small>${data.sender}</small></p><div class="d-flex justify-content-start mb-4">
            <div class="msg_container_incoming">
                ${data.Message}
            </div>
        </div>`
        document.getElementById("inn").innerHTML+=html;
        scrollToBottom();
    });
    function formprocess(){
        let Message=document.getElementById("mssg").value;
        if(reciever){
            io.emit("send_message",{
                sender:sender,
                reciever:reciever,
                Message:Message
            });
            var html="";
            html+=`<p id="you" class="d-flex justify-content-end"><small>You</small></p><div class="d-flex justify-content-end mb-2">
                <div class="msg_container_outgoing">
                    ${Message}
                </div>
            </div>`;
            document.getElementById("inn").innerHTML+=html;
            document.getElementById("mssg").value="";
            scrollToBottom();
        }else{
            alert("Please select the you want send the message");
        }
    }
    
