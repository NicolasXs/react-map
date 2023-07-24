import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  LayerGroup,
  useMapEvents,
} from "react-leaflet";

const ClickHandler = ({ setClickedPosition }) => {
  const map = useMapEvents({
    click(e) {
      setClickedPosition(e.latlng);
    },
  });
  return null;
};

const MapPopup = ({
  name,
  coordinates,
  formatCoordinates,
  calculateArea,
  calculatePerimeter,
}) => {
  const formattedCoordinates = useMemo(
    () => formatCoordinates(coordinates),
    [coordinates, formatCoordinates]
  );
  const area = useMemo(
    () => calculateArea(coordinates).toFixed(2),
    [coordinates, calculateArea]
  );
  const perimeter = useMemo(
    () => calculatePerimeter(coordinates).toFixed(2),
    [coordinates, calculatePerimeter]
  );

  return (
    <Popup>
      <h4>Nome: {name}</h4>
      <p>Coordenadas:</p>
      {formattedCoordinates}
      <p>Área: {area} km²</p>
      <p>Perímetro: {perimeter} km</p>
    </Popup>
  );
};

const MapComponent = ({
  center,
  zoom,
  data,
  colors,
  showAll,
  clickedPosition,
  setClickedPosition,
  selectedName,
  formatCoordinates,
  calculateArea,
  calculatePerimeter,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "80vh", width: "90vw" }}
    >
      <ClickHandler setClickedPosition={setClickedPosition} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showAll &&
        Object.entries(data).map(([name, { coordenadas }]) => (
          <LayerGroup key={name}>
            <Polygon positions={coordenadas} color={colors[name]}>
              <MapPopup
                name={name}
                coordinates={coordenadas}
                formatCoordinates={formatCoordinates}
                calculateArea={calculateArea}
                calculatePerimeter={calculatePerimeter}
              />
            </Polygon>
          </LayerGroup>
        ))}

      {!showAll && selectedName && data[selectedName]?.coordenadas && (
        <LayerGroup>
          <Polygon
            positions={data[selectedName].coordenadas}
            color={colors[selectedName]}
          >
            <MapPopup
              name={selectedName}
              coordinates={data[selectedName].coordenadas}
              formatCoordinates={formatCoordinates}
              calculateArea={calculateArea}
              calculatePerimeter={calculatePerimeter}
            />
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
  );
};

export default MapComponent;
