import React, { useEffect, useRef } from 'react'
import { latitudeAtom, longitudeAtom, watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify'


export const useGeoWatcher = () => {
  const setWatchedLatitude = useSetAtom(watchedLatitudeAtom);
  const setWatchedLongitude = useSetAtom(watchedLongitudeAtom);
  const watchIdRef = useRef<number | null>(null);

  const WatchSuccessCallback = (position: GeolocationPosition) => {
    console.log(`更新：緯度=${position.coords.latitude}, 経度=${position.coords.longitude}`);
    setWatchedLatitude(position.coords.latitude);
    setWatchedLongitude(position.coords.longitude);
  }

  const WatchErrorCallback = (error: GeolocationPositionError) => {
    console.error('位置情報監視エラー',error.message);
    toast.error(`位置情報監視に失敗しました：${error.message}`);
  }

  useEffect(() => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      WatchSuccessCallback,
      WatchErrorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    )
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  },[]);

  return null;
}

