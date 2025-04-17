// import { useAtomValue } from 'jotai'
// import { useEffect } from 'react'
// import { rankLatitudeAtom, rankLongitudeAtom } from './Atom'
// import { useMap } from 'react-leaflet';

import { useAtomValue } from "jotai"
import { watchedLatitudeAtom, watchedLongitudeAtom } from "./Atom"
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

// export const AutoFlyTo = () => {
//   const latitude = useAtomValue(rankLatitudeAtom);
//   const longitude = useAtomValue(rankLongitudeAtom);
//   const map = useMap();

//   useEffect(() => {
//     console.log('AutoFly作動 AutoFlyTo:', latitude, 'longitude:', longitude);
//     if(latitude && longitude) {
//       map.flyTo([latitude, longitude], map.getZoom());
//     }
//   },[latitude, longitude, map]);

//   return null;
// };

export const AutoFollow = () => {
  const watchedLatitude = useAtomValue(watchedLatitudeAtom);
  const watchedLongitude = useAtomValue(watchedLongitudeAtom);
  const map = useMap();
  const followUserRef = useRef(true);

  useEffect(() => {
    const stopFollowing = () => {
      followUserRef.current = false;
    }

    map.on('movestart', stopFollowing);

    return () => {
      map.off('movestart', stopFollowing);
    };
  }, [map]);

  useEffect(() => {
    if (watchedLatitude && watchedLongitude && followUserRef.current) {
        map.setView([watchedLatitude, watchedLongitude],map.getZoom(), {
          animate: true,
        })
    }
  },[watchedLatitude, watchedLongitude, map])
  return null;
};
