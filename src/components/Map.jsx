import "leaflet/dist/leaflet.css";
import MapControls from "./MapControls";
import { useState, useEffect } from "react";
import MapComponent from "./MapComponent";

import {
  getRandomColor,
  formatCoordinates,
  calculateArea,
  calculatePerimeter,
} from "./MapUtils";

export default function Map() {
  const [data, setData] = useState({});
  const [colors, setColors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [inputName, setInputName] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    setInputName(selectedName);
  }, [selectedName]);

  const handleAddCoordinate = () => {
    if (clickedPosition && inputName) {
      const color = getRandomColor(); // Gera uma cor aleatória para o polígono
      setColors((prevColors) => ({
        ...prevColors,
        [inputName]: color,
      }));

      setData((prevData) => ({
        ...prevData,
        [inputName]: {
          titulo: inputName,
          coordenadas: [
            ...(prevData[inputName]?.coordenadas || []), // Adiciona as coordenadas anteriores, se existirem
            [clickedPosition.lat, clickedPosition.lng],
          ],
        },
      }));

      setSelectedName(inputName);
      setClickedPosition(null);

      // Calcular área e perímetro após adicionar uma nova coordenada
      const newVertices = [
        ...(data[inputName]?.coordenadas || []),
        [clickedPosition.lat, clickedPosition.lng],
      ];
      const area = calculateArea(newVertices);
      const perimeter = calculatePerimeter(newVertices);
    }
  };

  const handleNameSelect = (e) => {
    setSelectedName(e.target.value);
    setClickedPosition(null);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setInputName("");
    setSelectedName("");
    setClickedPosition(null);
  };

  return (
    <>
      <MapControls
        inputName={inputName}
        setInputName={setInputName}
        handleAddCoordinate={handleAddCoordinate}
        handleShowAll={handleShowAll}
        selectedName={selectedName}
        handleNameSelect={handleNameSelect}
        data={data}
      />

      <MapComponent
        center={[-14.86, -40.84]}
        zoom={13}
        data={data}
        colors={colors}
        showAll={showAll}
        clickedPosition={clickedPosition}
        setClickedPosition={setClickedPosition}
        selectedName={selectedName}
        formatCoordinates={formatCoordinates}
        calculateArea={calculateArea}
        calculatePerimeter={calculatePerimeter}
      />
    </>
  );
}
