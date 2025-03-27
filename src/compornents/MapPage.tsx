import React from 'react'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import '../../node_modules/leaflet/dist/leaflet.css'; // 追加

export const MapPage = () => {
  return (
    <>
      <MapContainer
        center={[39.6202662,141.9571561]}
        zoom={15}
        scrollWheelZoom={true}
        zoomSnap={0.5}
        style={{ height: '100vh', width: '100vw' }} // 追加
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
