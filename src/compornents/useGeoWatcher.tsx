import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

import { useSetAtom } from 'jotai';
import { watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { supabase } from '../../utils/supabase';
import { GetUserDataId } from '../../lib/authUser';
import { GetUser } from '../../lib/user';

import { getDistanceFromLatLonInMeters } from '../../lib/getDistanceFromLatLonInMeters'
import { User } from '../domain/user';


export const useGeoWatcher = () => {
  const setWatchedLatitude = useSetAtom(watchedLatitudeAtom);
  const setWatchedLongitude = useSetAtom(watchedLongitudeAtom);
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{ latitude: number, longitude: number } | null>(null);
  const userIdRef = useRef<string | undefined>("");
  const userDataRef = useRef<User>(null);

  useEffect(() => {

    // 位置情報取得関数
    const WatchSuccessCallback = async (position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`更新：緯度=${position.coords.latitude}, 経度=${position.coords.longitude}`);

      userIdRef.current = await GetUserDataId();
      const userId = userIdRef.current
      userDataRef.current = await GetUser();
      const userData = userDataRef.current

      const lastPosition = lastPositionRef.current;

      if (lastPosition) {
        const distance = getDistanceFromLatLonInMeters(
          lastPosition.latitude,
          lastPosition.longitude,
          latitude,
          longitude
        );

        // 500メートル以上移動したら
        if (distance >= 500) {

          // set関数に保存
          setWatchedLatitude(latitude);
          setWatchedLongitude(longitude);
          toast.success('500メートル以上移動によりセット関数へ保存しました');

          // users_locationﾃｰﾌﾞﾙに位置情報挿入
          if (userId && userData) {
            const { error } = await supabase.from('users_location').upsert({
              id: userId,
              name: userData.name,
              location: `SRID=4326;POINT(${longitude} ${latitude})`,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            toast.success('500以上移動によりテーブルへ保存');
            if (error) {
              console.error('位置情報保存エラー', error.message)
              toast.error('位置情報の保存に失敗しました');
            }
          }

          lastPositionRef.current = { latitude, longitude }; // 新しい位置を記録
        } else {
          console.log('set関数に渡す緯度経度', latitude, longitude);
          // 初回はset関数に保存するだけ
          setWatchedLatitude(latitude);
          setWatchedLongitude(longitude);
          toast.success('500未満だけどセット関数へ保存');
          console.log('500未満だけどセット関数へ保存');

          lastPositionRef.current = { latitude, longitude };
        }
      } else {
        console.log('初回のセット関数保存', latitude, longitude);
        setWatchedLatitude(latitude);
        setWatchedLongitude(longitude);
      };
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
