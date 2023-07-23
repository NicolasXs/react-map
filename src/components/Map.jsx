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
      setSelectedName(inputName); // Define o nome recém-adicionado como o nome selecionado
      setClickedPosition(null);
    }
  };

  const handleNameSelect = (e) => {
    setSelectedName(e.target.value);
    setClickedPosition(null); // Limpa a posição do marcador para mostrar apenas o polígono selecionado manualmente
    setShowAll(false); // Desativar a visualização de todos os polígonos quando um nome for selecionado
  };

  const handleConcluir = () => {
    setInputName(""); // Limpa o input ao pressionar o botão "Concluir"
  };

  const handleShowAll = () => {
    setShowAll(true); // Mostrar todos os polígonos
    setSelectedName(""); // Limpar a seleção do dropdown
    setClickedPosition(null); // Limpar a posição do marcador
  };

  const handleShowSelected = () => {
    setShowAll(false); // Mostrar apenas o polígono selecionado
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

      {/* Dropdown para selecionar nomes salvos */}
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

        {/* Renderiza todos os polígonos */}
        {showAll &&
          Object.entries(data).map(([name, { coordenadas }]) => (
            <LayerGroup key={name}>
              <Polygon positions={coordenadas} color={colors[name]} />
            </LayerGroup>
          ))}

        {/* Renderiza apenas o polígono com as coordenadas do nome selecionado manualmente */}
        {!showAll && selectedName && data[selectedName]?.coordenadas && (
          <LayerGroup>
            <Polygon
              positions={data[selectedName].coordenadas}
              color={colors[selectedName]}
            />
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
