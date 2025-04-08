import { useAtom } from 'jotai';
import React from 'react'
import { latitudeAtom, longitudeAtom } from './Atom';
import { useMap } from 'react-leaflet';

export const CenterMapButton = (): React.JSX.Element => {
  const [latitude, setLatitude] = useAtom<number | null>(latitudeAtom);
  const [longitude, setLongitude] = useAtom<number | null>(longitudeAtom);
  const map = useMap();

  const handleClickSetView = ()  => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        setLatitude(latitude);
        setLongitude(longitude);
        if(latitude && longitude) {
          map.setView([latitude, longitude]);
        }

      })
    }
  }
  // locationの中身
  // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1743864790216}
  // coords: GeolocationCoordinates {latitude: 39.6197888, longitude: 141.9575296, altitude: null, accuracy: 1003.8823507422738, altitudeAccuracy: null, …} timestamp:1743864790216[[Prototype]]:GeolocationPosition
  return (

    <button
      className='border bg-blue-500 hover:bg-blue-400 cursor-pointer border-blue-500 rounded text-white absolute z-[1000] p-2 right-4 mt-5 mr-10'
      onClick={handleClickSetView}
    >
      現在地に移動
    </button>
  )

}

