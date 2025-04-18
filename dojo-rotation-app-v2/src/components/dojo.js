import React, { useState, useEffect } from "react";

import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Group } from "@mui/icons-material";

const TIME_SEC = 10; // 120 for 2 minutes

export const Dojo = () => {
  const rawData = JSON.parse(localStorage.getItem("dojoData"));
  const [columns, setColumns] = useState(rawData?.columns || []);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_SEC);

  const resetDojo = () => {
    setTimeLeft(TIME_SEC);
    localStorage.removeItem("dojoData");
    setColumns([]);
    setRound(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          rotateRoles();
          return TIME_SEC;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [columns, round]);

  const rotateRoles = () => {
    const newRound = round + 1;

    // Atualiza a rotação dos ícones (piloto e co-piloto)
    if (newRound % 1 === 0) {
      // A cada round (a cada 10 segundos ou o que você escolher)
      const updatedColumns = columns.map((col) => {
        const participants = [...col.participants];

        if (participants.length < 2) return col; // Se não houver pelo menos 2 participantes, não faz nada

        // Troca as posições do piloto e co-piloto, movendo os ícones
        const [pilot, copilot, ...rest] = participants;

        // Troca a posição dos ícones (🧑‍✈️ <=> 👨‍✈️)
        return {
          ...col,
          participants: [copilot, pilot, ...rest], // A troca de posição ocorre aqui
        };
      });

      setColumns(updatedColumns);
      localStorage.setItem(
        "dojoData",
        JSON.stringify({ columns: updatedColumns })
      ); // Sincroniza com o localStorage
    }

    // A cada 3 rodadas, mover o primeiro participante para a próxima coluna
    if (newRound % 3 === 0) {
      const updatedColumns = [...columns];

      // Mover o primeiro participante da coluna 1 para a última posição da coluna 2, e assim por diante
      updatedColumns.forEach((column, i) => {
        const firstParticipant = column.participants[0]; // Pega o primeiro participante

        if (firstParticipant) {
          // Remove o primeiro participante da coluna
          updatedColumns[i].participants =
            updatedColumns[i].participants.slice(1);

          // Encontra a próxima coluna para adicionar o participante
          const nextColumnIndex = (i + 1) % updatedColumns.length;

          // Adiciona o primeiro participante da coluna para a última posição da próxima coluna
          updatedColumns[nextColumnIndex].participants.push(firstParticipant);
        }
      });

      setColumns(updatedColumns);
      localStorage.setItem(
        "dojoData",
        JSON.stringify({ columns: updatedColumns })
      ); // Sincroniza com o localStorage
    }

    setRound(newRound);
  };

  if (!rawData) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h5" color="error">
          No columns created yet.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5, background: "#0d1117", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom color="white">
        🄀 Dojo Rotation
      </Typography>
      <Typography variant="body1" color="#8b949e" gutterBottom>
        ⏱️ Next rotation in: {timeLeft}s
      </Typography>

      <Button
        variant="outlined"
        color="error"
        onClick={resetDojo}
        sx={{ mb: 3 }}
      >
        Finish Dojo
      </Button>

      <Grid container spacing={3}>
        {columns.map((column, colIndex) => (
          <Grid item xs={12} sm={6} md={4} key={colIndex}>
            <Card
              sx={{ background: "#161b22", color: "#c9d1d9", borderRadius: 3 }}
            >
              <CardContent>
                <Typography variant="h6" color="#58a6ff" gutterBottom>
                  Column {colIndex + 1}
                </Typography>
                <Typography variant="subtitle2" color="#8b949e" gutterBottom>
                  Leader: {column.leader} |{" "}
                  <a
                    href={column.zoom}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#58a6ff" }}
                  >
                    Zoom
                  </a>
                </Typography>
                {column.participants.map((participant, index) => (
                  <Typography key={index} variant="body1">
                    {index === 0 && <span style={{ marginRight: 8 }}>🧑‍✈️</span>}
                    {index === 1 && (
                      <Group sx={{ verticalAlign: "middle", mr: 1 }} />
                    )}
                    {index > 1 && <span style={{ marginRight: 24 }} />}
                    {participant.name}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
