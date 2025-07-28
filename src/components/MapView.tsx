import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const position: [number, number] = [9.0624916, 38.7206048]; 

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Our Office</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
