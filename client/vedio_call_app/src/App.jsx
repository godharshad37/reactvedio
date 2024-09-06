

import Lobbyscreen from './screens/Lobby';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import RoomPage from './screens/Room';

function App() {


  return (
    <div  className="App">
      <Routes>
        <Route path='/' element={<Lobbyscreen/>}/>
        <Route path='/room/:roomId' element={<RoomPage/>}/>
      </Routes>
    </div>
  );
}

export default App
