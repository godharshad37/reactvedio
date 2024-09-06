import  { useState , useCallback,useEffect} from "react";
import { useSocket } from "../context/Socketprovider";
import { useNavigate } from "react-router-dom";

const Lobbyscreen =()=>{
    const [email,setemail]=useState("");
    const [room,setroom]=useState("");
    const navigate= useNavigate();

    const socket=useSocket();
    //console.log(socket);
    const handlesubmitform =useCallback(
        (e)=>{
            
            e.preventDefault(); // for not submiting form automatically
            socket.emit("room-join",{email,room});
        },
        [email,room,socket]
    );

    const handlejoinRoom= useCallback((data)=>{
        const{email,room}=data;
        navigate(`/room/${room}`,{ state: { email, room } });
    },[navigate]);

    useEffect(()=>{
        socket.on("room-join",handlejoinRoom);
        return ()=>{
            socket.off("room-join",handlejoinRoom);//This is a function that stops listening for a specific event. It essentially "turns off" the response to that event.
        }
    },[socket,handlejoinRoom]);
    //So, putting it all together: The line is telling the program to stop responding to the "room-join" event by using the handlejoinRoom function.

    return(
        <div>
            <h1>Lobby 1</h1>
            <form onSubmit={handlesubmitform}>
                <label htmlFor="email">Email:</label>
                <input type="emial" id="email" value={email} onChange={(e)=>
                    setemail(e.target.value)}></input>
                <br></br>
                <label htmlFor="room">room NO:</label>
                <input type="text" id="room"value={room} onChange={(e)=>
                    setroom(e.target.value)}></input>
                <br></br>
                <button>Join</button>
            </form>
        </div>
    );
};

export default Lobbyscreen;