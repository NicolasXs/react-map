import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  LayerGroup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";

const EARTH_RADIUS_KM = 6371; // Raio médio da Terra em quilômetros

export default function Map() {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [inputName, setInputName] = useState("");
  const [data, setData] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [colors, setColors] = useState({});
  const [showAll, setShowAll] = useState(false); // Estado para controlar se deve mostrar todos os polígonos

  const firstUpdate = useRef(true);

  function ClickHandler() {
    const map = useMapEvents({
      click(e) {
        if (firstUpdate.current) {
          firstUpdate.current = false;
          return;
        }
        setClickedPosition(e.latlng);
      },
    });
    return null;
  }

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

  const handleConcluir = () => {
    setInputName("");
  };

  const handleShowAll = () => {
    setShowAll(true);
    setSelectedName("");
    setClickedPosition(null);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const formatCoordinates = (coordenadas) => {
    return coordenadas.map(([lat, lng]) => `${lat}, ${lng}`).join(" | ");
  };

  const calculateArea = (vertices) => {
    let area = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
      const [lat1, lng1] = vertices[i];
      const [lat2, lng2] = vertices[(i + 1) % n];
      area +=
        toRadians(lng2 - lng1) *
        (2 + Math.sin(toRadians(lat1)) + Math.sin(toRadians(lat2)));
    }

    area = Math.abs((area * EARTH_RADIUS_KM * EARTH_RADIUS_KM) / 2);
    return area;
  };

  const calculatePerimeter = (vertices) => {
    let perimeter = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
      const [lat1, lng1] = vertices[i];
      const [lat2, lng2] = vertices[(i + 1) % n];
      const dLat = toRadians(lat2 - lat1);
      const dLng = toRadians(lng2 - lng1);
      perimeter +=
        2 *
        EARTH_RADIUS_KM *
        Math.asin(
          Math.sqrt(
            Math.sin(dLat / 2) ** 2 +
              Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLng / 2) ** 2
          )
        );
    }

    return perimeter;
  };

  const toRadians = (angle) => angle * (Math.PI / 180);

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

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "80vh", width: "90vw" }}
      >
        <ClickHandler />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showAll &&
          Object.entries(data).map(([name, { coordenadas }]) => (
            <LayerGroup key={name}>
              <Polygon positions={coordenadas} color={colors[name]}>
                <Popup>
                  <h4>Nome: {name}</h4>
                  <p>Coordenadas:</p>
                  {formatCoordinates(coordenadas)}
                  <p>Área: {calculateArea(coordenadas).toFixed(2)} km²</p>
                  <p>
                    Perímetro: {calculatePerimeter(coordenadas).toFixed(2)} km
                  </p>
                </Popup>
              </Polygon>
            </LayerGroup>
          ))}

        {!showAll && selectedName && data[selectedName]?.coordenadas && (
          <LayerGroup>
            <Polygon
              positions={data[selectedName].coordenadas}
              color={colors[selectedName]}
            >
              <Popup>
                <h4>Nome: {selectedName}</h4>
                <p>Coordenadas:</p>
                {formatCoordinates(data[selectedName].coordenadas)}
                <p>
                  Área:{" "}
                  {calculateArea(data[selectedName].coordenadas).toFixed(2)} km²
                </p>
                <p>
                  Perímetro:{" "}
                  {calculatePerimeter(data[selectedName].coordenadas).toFixed(
                    2
                  )}{" "}
                  km
                </p>
              </Popup>
            </Polygon>
          </LayerGroup>
        )}

        {clickedPosition && (
          <LayerGroup>
            <Popup
              position={clickedPosition}
              onClose={() => setClickedPosition(null)}
            >
              <div>
                <h3>Popup do Marcador</h3>
                <p>Latitude: {clickedPosition.lat}</p>
                <p>Longitude: {clickedPosition.lng}</p>
              </div>
            </Popup>
          </LayerGroup>
        )}
      </MapContainer>
    </>
  );
}
