import React from 'react'
import { useMap } from 'react-leaflet';
import { useAtomValue } from 'jotai';
import { watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';

export const CenterMapButton = (): React.JSX.Element => {
  const watchedLatitude = useAtomValue(watchedLatitudeAtom)
  const watchedLongitude = useAtomValue(watchedLongitudeAtom)
  const map = useMap();

  const handleClickSetView = () => {
    if (watchedLatitude && watchedLongitude) {
      map.setView([watchedLatitude, watchedLongitude]); // 地図の中心を更新
    } else {
      console.log('wathed位置情報なし');
    }
  };
  // locationの中身
  // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1743864790216}
  // coords: GeolocationCoordinates {latitude: 39.6197888, longitude: 141.9575296, altitude: null, accuracy: 1003.8823507422738, altitudeAccuracy: null, …} timestamp:1743864790216[[Prototype]]:GeolocationPosition
  return (

    <button
      className='
      text-white
      border border-blue-500
      bg-blue-500
      hover:bg-blue-400
      cursor-pointer
      rounded
      absolute z-[1000]
      p-2 right-4 mt-5 mr-10'
      onClick={handleClickSetView}
    >
      現在地に移動
    </button>
  )
}

