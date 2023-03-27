import { useEffect, useState } from "react";
import Board from "./Board";

const GamePanel = ({ users, currentUser, play, gameMove, leaveGame }) => {
    const [userToPlay, setUserToPlay] = useState();
    useEffect(() => {
        let u = users.filter(x => x.user == currentUser)[0];
        setUserToPlay(u)
    }, [users]);
    return <div>
        <div className="d-flex justify-content-center mb-3">
            {users.map((user, index) =>
                <div key={index} className="mx-5">
                    Player {index + 1}: <br />
                    <div className="d-flex align-items-center">
                        <span className="dot" style={{ backgroundColor: user.color }}></span>
                        <h4 className="m-0 ps-2">{user.user}</h4>
                    </div>
                </div>
            )}
        </div>
        {userToPlay &&
            <Board user={userToPlay} play={play} gameMove={gameMove} leaveGame={leaveGame} />
        }
    </div>
}

export default GamePanel;