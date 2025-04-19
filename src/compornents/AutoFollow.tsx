import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useAtomValue } from "jotai"
import { watchedLatitudeAtom, watchedLongitudeAtom } from "./Atom"

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
