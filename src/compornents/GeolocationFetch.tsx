import { atom, useAtom } from 'jotai';
import { latitudeAtom, loadingAtom, longitudeAtom } from './Atom';
import { useNavigate } from 'react-router';

export const GeolocationFetch = () => {
  const navigate = useNavigate();

  const [latitude, setLatitude] = useAtom<number | null>(latitudeAtom);
  const [longitude, setLongitude] = useAtom<number | null>(longitudeAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const onClickFetchGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    setLoading(true);
  }

  const successCallback = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude); // 緯度取得
    setLongitude(position.coords.longitude); // 経度取得
    navigate('/mapPage');
    setLoading(false);
  };

  const errorCallback = (error: GeolocationPositionError) => {
    setLoading(false);
    alert('位置情報を取得できませんでした');
  };

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
          </div>
        </div>
      )}
    </>
  )
}
