// components/EvolutionCardDetail.jsx
import React from "react";
import { ProgressBar, Card } from "react-bootstrap";

const EvolutionCardDetail = ({ pokemon }) => {
  if (!pokemon) return null;

  const { name, sprites, stats, types, height, weight, order } = pokemon;

  return (
    <Card style={{ width: "18rem", padding: "1rem", textAlign: "center" }}>
      <Card.Img
        variant="top"
        src={sprites.other["official-artwork"].front_default}
        alt={name}
        style={{ width: "120px", height: "120px", margin: "auto" }}
      />
      <Card.Body>
        <Card.Title className="text-capitalize">{name}</Card.Title>
        <div className="mb-2">
          <strong>Ordre :</strong> {order} <br />
          <strong>Taille :</strong> {height / 10}m <br />
          <strong>Poids :</strong> {weight / 10}kg <br />
          <strong>Type :</strong>{" "}
          {types.map((t) => (
            <span key={t.type.name} className="badge bg-danger mx-1">
              {t.type.name.toUpperCase()}
            </span>
          ))}
        </div>
        <div>
          {stats.map((stat, i) => (
            <div key={i} className="text-start mb-1">
              <small>{stat.stat.name.toUpperCase()}</small>
              <ProgressBar
                now={stat.base_stat}
                label={stat.base_stat}
                variant="primary"
                style={{ height: "10px" }}
              />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EvolutionCardDetail;
