export const EARTH_RADIUS_KM = 6371;

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const formatCoordinates = (coordenadas) => {
  return coordenadas.map(([lat, lng]) => `${lat}, ${lng}`).join(" | ");
};

export const calculateArea = (vertices) => {
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

export const calculatePerimeter = (vertices) => {
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

export const toRadians = (angle) => angle * (Math.PI / 180);
