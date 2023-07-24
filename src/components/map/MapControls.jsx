import React from "react";

const MapControls = ({
  inputName,
  setInputName,
  handleAddCoordinate,
  handleConcluir,
  handleShowAll,
  selectedName,
  handleNameSelect,
  data,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Nome"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      />
      <button onClick={handleAddCoordinate}>Adicionar</button>
      <button onClick={handleConcluir}>Concluir</button>
      <button onClick={handleShowAll}>Visualizar Todos</button>

      <select value={selectedName} onChange={handleNameSelect}>
        <option value="">Selecione um nome</option>
        {Object.keys(data).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
};

export default MapControls;
