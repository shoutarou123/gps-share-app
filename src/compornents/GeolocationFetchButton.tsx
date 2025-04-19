import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { latitudeAtom, longitudeAtom } from './Atom';

export const GeolocationFetchButton = () => {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useAtom<number | null>(latitudeAtom);
  const [longitude, setLongitude] = useAtom<number | null>(longitudeAtom);

  const watchIdRef = useRef<number | null>(null); // 監視している位置情報保存用

  // 緯度経度取得成功関数
  const latitudeLongitudeSuccessCallback = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude); // 緯度取得
    setLongitude(position.coords.longitude); // 経度取得
    setTimeout(() => {
      navigate('/mapPage'); // 初回取得時のみ画面遷移
    }, 1000)
  };

  // 緯度経度取得失敗関数
  const latitudeLongitudeErrorCallback = (error: GeolocationPositionError) => {
    console.log('位置情報を取得できませんでした');
  };

  // 位置情報を取得
  const onClickFetchGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      latitudeLongitudeSuccessCallback,
      latitudeLongitudeErrorCallback,
      {
        enableHighAccuracy: true
      }
    );
  }
  return (
    <>
      <button
        className="
        py-5
        bg-teal-600
        hover:bg-teal-700
        focus:outline-none focus:ring-2 focus:ring-teal-500
        rounded-2xl
        font-black
        border
        text-white text-2xl
        cursor-pointer
        "
        onClick={onClickFetchGeoLocation}
      >
        Map
      </button>
    </>
  )
}
