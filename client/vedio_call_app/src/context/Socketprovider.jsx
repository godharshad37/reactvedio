import {createContext , useContext, useMemo} from "react";
import PropTypes from 'prop-types'; // Add this line to import PropTypes

import {io} from 'socket.io-client';// It’s like saying, "I only want the io part from the library."

const socketcontext = createContext(null);

export const useSocket = () =>{
    const socket = useContext(socketcontext);
    return socket;
}

export const SocketProvider= (props)=>{
    const socket = useMemo(()=> io("localhost:8000"),[]);//In summary, this line creates a WebSocket connection to a server running on your local machine at port 8000 and ensures that the connection is only created once when the component is first loaded, improving performance.
    return(
        <socketcontext.Provider value={socket}>
            {props.children}
        </socketcontext.Provider>
    )
}