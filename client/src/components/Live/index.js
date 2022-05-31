import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
export default function Live(props) {
  const { id } = useParams();
  const { user } = useUserContext();
  const domain = "meet.jit.si";
  let api = {};

  const navigate = useNavigate();

  // INTIALISE THE MEET WITH THIS FUNCTION
  const startMeet = useCallback(() => {
    const options = {
      roomName: id,
      width: "100%",
      height: 500,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        // overwrite interface properties if you want
      },
      // VIDEO FRAME WILL BE ADDED HERE
      parentNode: document.querySelector("#jitsi-iframe"),
      userInfo: {
        displayName: user.name,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListeners({
      readyToClose: handleClose,
      participantLeft: handleParticipantLeft,
      participantJoined: handleParticipantJoined,
      videoConferenceJoined: handleVideoConferenceJoined,
      videoConferenceLeft: handleVideoConferenceLeft,
    });
  }, [api]);

  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
  }, [startMeet]);

  // ALL OUR HANDLERS
  const handleClose = () => {};

  const handleParticipantLeft = async (participant) => {
    await getParticipants();
  };

  const handleParticipantJoined = async (participant) => {
    await getParticipants();
  };

  const handleVideoConferenceJoined = async (participant) => {
    await getParticipants();
  };

  const handleVideoConferenceLeft = () => {
    navigate("/");
  };

  // GETTING ALL PARTICIPANTS
  const getParticipants = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.getParticipantsInfo());
      }, 500);
    });
  };

  return (
    <React.Fragment>
      <header
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          color: "white",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, padding: 10 }}>Doctor Meeting</p>
      </header>
      <div id="jitsi-iframe" style={{ marginBottom: 0 }}></div>
      <div
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          height: "20vh",
          margin: 0,
        }}
      ></div>
    </React.Fragment>
  );
}
