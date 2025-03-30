import { atom, useAtom } from 'jotai';
import { latitudeAtom, loadingAtom, longitudeAtom } from './Atom';
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';

export const GeolocationFetch = () => {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useAtom<number | null>(latitudeAtom);
  const [longitude, setLongitude] = useAtom<number | null>(longitudeAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  
  const watchIdRef = useRef<number | null>(null); // 監視している位置情報保存用

  const onClickFetchGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(latitudeLongitudeSuccessCallback, latitudeLongitudeErrorCallback); // 位置情報を取得
    watchIdRef.current = navigator.geolocation.watchPosition(WatchSuccessCallback, WatchErrorCallback) // 位置情報監視を取得してuseRefに保存
    setLoading(true); // Loading...を表示
  }
  
  // 位置情報監視成功関数
  const WatchSuccessCallback = (position :GeolocationPosition) => {
    console.log('監視中の位置情報', position.coords);
  }
  
  // 位置情報監視失敗関数
  const WatchErrorCallback = (error: GeolocationPositionError) => {
    console.log(error);
    alert('位置情報監視に失敗しました');
  };
  
  // 緯度経度取得成功関数
  const latitudeLongitudeSuccessCallback = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude); // 緯度取得
    setLongitude(position.coords.longitude); // 経度取得
    setLoading(false);
    navigate('/mapPage'); // 初回取得時のみ画面遷移
  };

  // 緯度経度取得失敗関数
  const latitudeLongitudeErrorCallback = (error: GeolocationPositionError) => {
    setLoading(false);
    alert('位置情報を取得できませんでした');
  };

  // 位置情報クリア関数
  const stopWatching = () => {
    if(watchIdRef.current !== null) { // 位置情報が入っているときに
      navigator.geolocation.clearWatch(watchIdRef.current); // 位置情報をクリアする
      watchIdRef.current = null; // watchIdRef.currentの中身もnullにする
    }
  };

  useEffect(() => {
    return () => {
      stopWatching(); // 本ｺﾎﾟｰﾈﾝﾄからｱｲﾏｳﾝﾄした場合に位置情報をｸﾘｱする関数が実行される
    };
  },[]);

  return (
    <>
      {loading ? (
        <div
        className='flex flex-col text-xl font-bold items-center'
        >Loading...</div>
      ) : (
        <div
          className='flex flex-col items-center justify-center'
        >
          <div
            className='flex flex-col items-center'
          >
            <div className='text-xl font-bold'>GeolocationFetchページ</div>
            <button
              className='py-1 px-5 bg-sky-500 rounded-2xl font-black border text-white'
              onClick={onClickFetchGeoLocation}
            >位置情報を取得後画面遷移</button>

            {/* <button
            className='py-1 px-5 bg-blue-500 rounded-2xl font-black border text-white cursor-pointer'
              onClick={onClickWatch}
            >位置情報監視ボタン</button> */}
          </div>
        </div>
      )}
    </>
  )
}
