import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Leader = () => {
  const [leader, setLeader] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [participants, setParticipants] = useState(['']);
  const [state, setState] = useState({
    columns: [],
    timer: null,
    isRunning: false,
    currentTime: 120,
    currentRound: 0,
  });

  useEffect(() => {
    socket.on('state_update', (newState) => {
      setState(newState);
    });

    return () => {
      socket.off('state_update');
    };
  }, []);

  const addParticipantInput = () => {
    setParticipants([...participants, '']);
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leader.trim() || !zoomLink.trim() || participants.length === 0) return;

    socket.emit('add_column', {
      leader,
      zoomLink,
      participants: participants.filter((p) => p.trim()),
    });

    setLeader('');
    setZoomLink('');
    setParticipants(['']);
  };

  const startDojo = () => {
    socket.emit('start_dojo');
  };

  const finishChallenge = (columnId) => {
    socket.emit('finish_challenge', columnId);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container">
      {state.isRunning && (
        <div className="timer">
          Round {state.currentRound + 1} - Time: {formatTime(state.currentTime)}
        </div>
      )}

      <h1>Code Dojo Leader</h1>

      <form onSubmit={handleSubmit} className="column-form">
        <div>
          <label>Leader:</label>
          <input
            type="text"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Zoom Link:</label>
          <input
            type="url"
            value={zoomLink}
            onChange={(e) => setZoomLink(e.target.value)}
            required
          />
        </div>

        <div className="participants">
          <label>Participants:</label>
          {participants.map((participant, index) => (
            <div key={index} className="participant-input">
              <input
                type="text"
                value={participant}
                onChange={(e) => handleParticipantChange(index, e.target.value)}
                required={index === 0}
              />
              {index === participants.length - 1 && (
                <button type="button" onClick={addParticipantInput}>
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit">Finish Column</button>
      </form>

      <div className="columns-container">
        {state.columns.map((column) => (
          <div key={column.id} className="column">
            <h3>{column.leader}</h3>
            <a href={column.zoomLink} target="_blank" rel="noopener noreferrer">
              Join Zoom
            </a>
            <ul>
              {column.participants.map((participant, index) => (
                <li
                  key={index}
                  className={participant.isActive ? 'active' : ''}
                >
                  {participant.name}
                  {participant.activeRounds > 0 && (
                    <span> (Round {participant.activeRounds})</span>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => finishChallenge(column.id)}>
              Finish Challenge
            </button>
          </div>
        ))}
      </div>

      {!state.isRunning && state.columns.length > 0 && (
        <button onClick={startDojo} className="start-dojo">
          Start Dojo
        </button>
      )}
    </div>
  );
};

export default Leader;
