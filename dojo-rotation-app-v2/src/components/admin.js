import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Add, CheckCircle } from "@mui/icons-material";

export const Admin = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([
    {
      leader: "",
      zoom: "",
      participants: [{ name: "" }],
    },
  ]);

  const handleAddParticipant = (colIndex) => {
    const newColumns = [...columns];
    newColumns[colIndex].participants.push({ name: "" });
    setColumns(newColumns);
  };

  const handleParticipantChange = (colIndex, index, value) => {
    const newColumns = [...columns];
    newColumns[colIndex].participants[index].name = value;
    setColumns(newColumns);
  };

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        leader: "",
        zoom: "",
        participants: [{ name: "" }],
      },
    ]);
  };

  const handleColumnMetaChange = (colIndex, field, value) => {
    const newColumns = [...columns];
    newColumns[colIndex][field] = value;
    setColumns(newColumns);
  };

  const handleFinish = () => {
    const initializedColumns = columns?.map((col) => ({
      leader: col.leader,
      zoom: col.zoom,
      participants: col.participants.filter((p) => p.name),
    }));
    localStorage.setItem(
      "dojoData",
      JSON.stringify({ columns: initializedColumns })
    );
    navigate("/dojo");
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Admin - Create User Rotation
      </Typography>

      {columns?.map((column, colIndex) => (
        <Box
          key={colIndex}
          mb={4}
          p={2}
          borderRadius={2}
          border="1px solid #ccc"
        >
          <Typography variant="h6" gutterBottom color="secondary">
            Team {colIndex + 1}
          </Typography>

          <TextField
            fullWidth
            label="Leader Name"
            value={column.leader}
            onChange={(e) =>
              handleColumnMetaChange(colIndex, "leader", e.target.value)
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Zoom Link"
            value={column.zoom}
            onChange={(e) =>
              handleColumnMetaChange(colIndex, "zoom", e.target.value)
            }
            sx={{ mb: 3 }}
          />

          {column?.participants?.map((participant, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label={`Participant ${index + 1}`}
                value={participant.name}
                onChange={(e) =>
                  handleParticipantChange(colIndex, index, e.target.value)
                }
                fullWidth
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddParticipant(colIndex)}
          >
            Add Participant
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="secondary"
        sx={{ mr: 2 }}
        onClick={handleAddColumn}
      >
        Add Column
      </Button>

      <Button
        variant="contained"
        color="primary"
        endIcon={<CheckCircle />}
        onClick={handleFinish}
      >
        Finish Column
      </Button>
    </Container>
  );
};
