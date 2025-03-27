import React from 'react'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import '../../node_modules/leaflet/dist/leaflet.css'; // 追加
import { useAtomValue } from 'jotai';
import { latitudeAtom, loadingAtom } from './Atom';

export const MapPage = () => {
  const latitude = useAtomValue(latitudeAtom);
  const longitude = useAtomValue(loadingAtom);

  return (
    <>
    <h1>{latitude}</h1>
    <h1>{longitude}</h1>
      <MapContainer
        center={
          latitude && longitude ? [latitude, longitude] : [35.681641, 139.766921]
        }
        zoom={17}
        scrollWheelZoom={true} // scrollでzoom可
        zoomSnap={0.5} // zoomの段階調整
        style={{ height: '100vh', width: '100vw' }} // 追加
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={
            latitude && longitude ? [latitude, longitude] : [35.681641, 139.766921]
          }
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
