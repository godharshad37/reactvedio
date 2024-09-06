import {useCallback, useEffect,useState} from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import PropTypes from 'prop-types'

import { useSocket } from "../context/Socketprovider";

const RoomPage= ()=>{
    const socket=useSocket();
    const [remotesocketId,setremotesocketId]=useState(null);
    const [mystream,setmystream]=useState(null);
    const [remotestream,setremotestream]=useState(null);


    const handleCalluser = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true,});
        if(stream)
        {
            console.log("stream is ready");
        }
        const offer = await peer.getoffer();
        socket.emit('user-call',{to:remotesocketId,offer});
        setmystream(stream);
    },[remotesocketId,socket]);


    const handlerUserjoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined room `);
        setremotesocketId(id);
    },[]) 

    const handleincomingcall=useCallback(async({from,offer})=>{
        setremotesocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({video: true,audio: true,});
        setmystream(stream);
        const ans=await peer.getanswer(offer);
        socket.emit("call-accepted",{to:from,ans});
    },[socket])

    const sendstreams = useCallback(()=>{
        for(const track of mystream.getTracks()){//track means audio
            peer.peer.addTrack(track,mystream);
        }
    },[mystream],);

    const handlecallaccepted = useCallback(({ans})=>{
        peer.setLocalDescription(ans);
        console.log("call-accepted");
        //sendstreams();
        // so these tracks are likely audio tracks that you want to send over the connection. 
        

    },[sendstreams],);

    const handlenegoneded = useCallback(async()=>{
        const offer = await peer.getoffer();
        socket.emit("peer-nego-needed",{to:remotesocketId,offer});
    },[remotesocketId,socket]);

    useEffect(()=>{
        peer.peer.addEventListener("negotiationneeded",handlenegoneded);
        return () =>{
            peer.peer.removeEventListener("negotiationneeded",handlenegoneded);
        };
    },[handlenegoneded]);


    const handlenegoneedincoming = useCallback(async({from,offer})=>{
        const ans = await peer.getanswer(offer);
        socket.emit("peer-nego-done",{to:from,ans});
    },[socket]);

    const handlenegoneedfinal = useCallback(async({ans})=>{
        await peer.setLocalDescription(ans);
    },[]);

//this code sets up an event listener to handle incoming video or audio tracks from a remote peer
// in a WebRTC connection. When a track is received, it updates the component's state with the new 
//remote stream, allowing the user interface to reflect the incoming media from the other participant in the WebRTC session.
    useEffect(()=>{
        peer.peer.addEventListener('track',async (e)=>{
            console.log("GOT TRACKS!!");
            setremotestream(e.streams[0]);
        });
    },[]);

    useEffect(()=>{
        socket.on("user-joined",handlerUserjoined);
        socket.on("incoming-call",handleincomingcall);
        socket.on("call-accepted",handlecallaccepted);
        socket.on("peer-nego-needed",handlenegoneedincoming);
        socket.on("peer-nego-final",handlenegoneedfinal)

        return ()=>{
            socket.off("user-joined",handlerUserjoined);
            socket.off("incoming-call",handleincomingcall);
            socket.off("call-accepted",handlecallaccepted);
            socket.off("peer-nego-needed",handlenegoneedincoming);
            socket.off("peer-nego-final",handlenegoneedfinal)
        };
    },[socket,
        handlerUserjoined,
        handleincomingcall,
        handlecallaccepted,
        handlenegoneedincoming,
        handlenegoneedfinal,
    ]);

   
    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remotesocketId ?'connected':'no one in room'}</h4>
            {
                mystream && <button onClick={sendstreams}>send stream</button>
            }
            {
                remotesocketId && <button onClick={handleCalluser}>Call</button>// if there is aleardy someone prsent in room then he make a call to other user who is prsent at that room
            }
            {mystream && (
            <>
                <h1>My Stream</h1>
                <ReactPlayer
                    playing
                    muted
                    height="50%"
                    width="50%"
                    url={mystream}
                />
            </>
            )}
            {remotestream && (
            <>
                <h1>remote stream</h1>
                <ReactPlayer
                    playing
                    muted
                    height="50%"
                    width="50%"
                    url={remotestream}
                />
            </>
            )}
        </div>
        
    );
};

// RoomPage.propTypes = {
    
//     remotesocketId: PropTypes.string.isRequired,
//     mystream: PropTypes.any.isRequired,
//     sendstreams: PropTypes.func.isRequired,
//     handleCallUser: PropTypes.func.isRequired,
//   }
export default RoomPage;