import './App.css';
import './connect4.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lobby from './components/Lobby';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';
import ConnectedUsers from './components/ConnectedUsers';
import { Button } from 'react-bootstrap';
import InvitationBox from './components/InvitationBox';
import GamePanel from './components/GamePanel';

const App = () => {
  const [connection, setConnection] = useState();
  const [users, setUsers] = useState([]);
  const [gameUsers, setGameUsers] = useState([]);
  const [currentUser, setCurrentUsers] = useState({});
  const [invitationFrom, setInvitationFrom] = useState();
  const [gameStart, setGameStart] = useState(false);
  const [gameMove, setGameMove] = useState();

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7114/game")
        .configureLogging(LogLevel.Information)
        .build();

      setCurrentUsers(user);

      connection.on("StartGame", (user) => {
        setGameStart(true);
        setInvitationFrom();
      });

      connection.on("UsersInRoom", (users) => {
        setGameStart(false);
        setUsers(users);
        setGameMove();
      });

      connection.on("UsersInGame", (users) => {
        setGameStart(true);
        setGameUsers(users);
      });

      connection.on("ReturnPlay", (gameMove) => {
        setGameMove(gameMove);
      });

      connection.on("ReceiveInvitation", (fromUser) => {
        setInvitationFrom(fromUser);
      });

      connection.onclose(e => {
        setConnection();
        setUsers([]);
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  }

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  }

  const acceptInvitation = async (opponentUser) => {
    try {
      await connection.invoke("AcceptInvitation", opponentUser);
    } catch (e) {
      console.log(e);
    }
  }

  const play = async (coord) => {
    try {
      await connection.invoke("Play", coord);
    } catch (e) {
      console.log(e);
    }
  }

  const leaveGame = async () => {
    try {
      await connection.invoke("LeaveGame");
    } catch (e) {
      console.log(e);
    }
  }

  const refuseInvitation = () => {
    setInvitationFrom();
  }

  const sendInvitation = async (connectionId, fromUser) => {
    try {
      await connection.invoke("SendInvite", connectionId, fromUser);
    } catch (e) {
      console.log(e);
    }
  }

  return <div className='app'>
    <h1 className='mb-5'>Game: Connect 4</h1>
    {!connection
      ? <Lobby joinRoom={joinRoom} />
      :
      <>
        {(gameStart && gameUsers)
          ?
          <GamePanel users={gameUsers} currentUser={currentUser} play={play} gameMove={gameMove} leaveGame={leaveGame} />
          :
          <>
            <div className='row justify-content-center'>
              <div className='col-11 p-0 text-start ms-5'>
              <Button variant="danger" onClick={() => closeConnection()}>Leave</Button>

              </div>
            </div>
            <ConnectedUsers users={users} currentUser={currentUser} sendInvitation={sendInvitation} />
          </>
        }
      </>
    }
    {invitationFrom &&
      <InvitationBox fromUser={invitationFrom} refuseInvitation={refuseInvitation} acceptInvitation={acceptInvitation} />
    }
  </div>
}

export default App;
