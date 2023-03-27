const ConnectedUsers = ({ users, currentUser, sendInvitation }) => <div>
    <h4>Online Users</h4>
    <div className="row justify-content-center">
        {users.map((u, idx) =>
            <div key={idx} className="col-5 d-flex justify-content-between align-items-center m-3" style={{backgroundColor: "navy"}} >
                <span className="text-white py-2">{u}</span>
                {u !== currentUser &&
                    <button onClick={() => sendInvitation(u, currentUser)} className="btn btn-link">Invite</button>
                }
            </div>
        )}
    </div>
</div>
export default ConnectedUsers;