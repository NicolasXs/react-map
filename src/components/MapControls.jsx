import React from "react";
import "./MapControls.css";

const MapControls = ({
  inputName,
  setInputName,
  handleAddCoordinate,
  handleShowAll,
  selectedName,
  handleNameSelect,
  data,
}) => {
  return (
    <div className="controls">
      <h1 className="title">Cadastro de polígonos</h1>
      <input
        className="input"
        type="text"
        placeholder="Nome"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      />
      <button className="button" onClick={handleAddCoordinate}>
        Adicionar
      </button>
      <button className="button" onClick={handleShowAll}>
        Visualizar Todos
      </button>

      <select value={selectedName} onChange={handleNameSelect}>
        <option value="">Selecione um nome</option>
        {Object.keys(data).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MapControls;
