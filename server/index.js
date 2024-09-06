
const { Server} =require("socket.io");

const io= new Server(8000,{
    cors:true,
});
//to see which email id on which room
const emailTosocketIdmap = new Map();
const socketIdToeamilmap = new Map();

io.on("connection",(socket) => {
    console.log(`socket connected`,socket.id);
    socket.on("room-join" ,(data) =>{
        const{email, room}=data;
        emailTosocketIdmap.set(email,socket.id);
        socketIdToeamilmap.set(socket.id,email);
        io.to(room).emit("user-joined",{email, id:socket.id})//This is helpful for notifying all users in the room that a new user has joined, along with some identifying information about that user
        socket.join(room);//This line makes the connected socket join the specified room.
        io.to(socket.id).emit("room-join",data);
    });

    socket.on("user-call",({to,offer})=>{
        io.to(to).emit("incoming-call",{from: socket.id,offer});
    });

    socket.on("call-accepted",({to,ans})=>{
        io.to(to).emit("call-accepted",{from: socket.id,ans});
    });

    socket.on("peer-nego-needed",({to,offer})=>{
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer-nego-needed",{from:socket.id,offer});
    });

    socket.on("peer-nego-done",({to,ans})=>{
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer-nego-final",{from:socket.id,ans});
    });
});