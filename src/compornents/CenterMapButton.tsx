import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react'
import { latitudeAtom, longitudeAtom, manualLatitudeAtom, manualLongitudeAtom, watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { useMap } from 'react-leaflet';

export const CenterMapButton = (): React.JSX.Element => {
  const [manualLatitude, setManualLatitude] = useAtom(manualLatitudeAtom);
  const [manualLongitude, setManualLongitude] = useAtom(manualLongitudeAtom);
  const watchedLatitude = useAtomValue(watchedLatitudeAtom)
  const watchedLongitude = useAtomValue(watchedLongitudeAtom)
  const map = useMap();

  const handleClickSetView = () => {
    console.log('ボタンがクリックされました');

      // 監視値ﾘｾｯﾄ
      // setWatchedLatitude(null);
      // setWatchedLongitude(null);

    // navigator.geolocation.getCurrentPosition((location) => {
    //   console.log('現在地に戻るのlocation値', location);
    //   setManualLatitude(location.coords.latitude);
    //   setManualLongitude(location.coords.longitude);

    if (watchedLatitude && watchedLongitude) {
      map.setView([watchedLatitude, watchedLongitude]);
      console.log('地図の中心を更新しました');
    } else {
      console.log('wathed位置情報なし');
    }
  };
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

