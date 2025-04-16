import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

import { useSetAtom } from 'jotai';
import { watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { supabase } from '../../utils/supabase';
import { GetUserDataId } from '../../lib/authUser';
import { GetUser } from '../../lib/user';


export const useGeoWatcher = () => {
  const setWatchedLatitude = useSetAtom(watchedLatitudeAtom);
  const setWatchedLongitude = useSetAtom(watchedLongitudeAtom);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {

    // 位置情報取得関数
    const WatchSuccessCallback = async (position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`更新：緯度=${position.coords.latitude}, 経度=${position.coords.longitude}`);

      setWatchedLatitude(latitude);
      setWatchedLongitude(longitude);

      const userId = await GetUserDataId();
      console.log('userIdの値', userId);
      const userData = await GetUser();

      // users_locationﾃｰﾌﾞﾙに位置情報挿入
      if (userId) {
        const { error } = await supabase.from('users_location').upsert({
          id: userId,
          name: userData.name,
          location: `SRID=4326;POINT(${longitude} ${latitude})`,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        if (error) {
          console.error('位置情報保存エラー', error.message)
          toast.error('位置情報の保存に失敗しました');
        }
      }
    }

    // 位置情報取得エラー関数
    const WatchErrorCallback = (error: GeolocationPositionError) => {
      console.error('位置情報監視エラー', error.message);
      toast.error(`位置情報監視に失敗しました：${error.message}`);
    }

    // 位置情報監視スタート navigator.geolocation.watchPosition()で自動的にpositionが渡される
    watchIdRef.current = navigator.geolocation.watchPosition(
      WatchSuccessCallback, // ←ここにpositionが渡される
      WatchErrorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );

    // アイマウント時に監視解除
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
}
