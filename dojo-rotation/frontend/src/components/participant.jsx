import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Participant = () => {
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

      <h1>Code Dojo Participant</h1>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participant;
