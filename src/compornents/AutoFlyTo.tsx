import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { rankLatitudeAtom, rankLongitudeAtom } from './Atom'
import { useMap } from 'react-leaflet';

export const AutoFlyTo = () => {
  const latitude = useAtomValue(rankLatitudeAtom);
  const longitude = useAtomValue(rankLongitudeAtom);
  const map = useMap();

  useEffect(() => {
    console.log('AutoFly作動 AutoFlyTo:', latitude, 'longitude:', longitude);
    if(latitude && longitude) {
      map.flyTo([latitude, longitude], map.getZoom());
    }
  },[latitude, longitude, map]);

  return null;
};

