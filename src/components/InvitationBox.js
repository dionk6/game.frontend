
const InvitationBox = ({ fromUser, refuseInvitation, acceptInvitation }) => {
    return <div className="mt-5">
        <h3>
            You have recieved an invitation from: {fromUser}
        </h3>
        <br />
        <h5>
            Do you accept the challenge?
        </h5>
        <div className="d-flex justify-content-center">
            <button className="me-2 btn btn-success" onClick={() => acceptInvitation(fromUser)}>Yes</button>
            <button onClick={() => refuseInvitation()} className="btn btn-danger">No</button>
        </div>
    </div>
}

export default InvitationBox;