import { useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { latitudeAtom, longitudeAtom } from './Atom'
import { useMap } from 'react-leaflet';

export const AutoFlyTo = () => {
  const latitude = useAtomValue(latitudeAtom);
  const longitude = useAtomValue(longitudeAtom);
  const map = useMap();

  useEffect(() => {
    if(latitude && longitude) {
      map.flyTo([latitude, longitude], map.getZoom());
    }
  },[latitude, longitude, map]);

  return null;
};

