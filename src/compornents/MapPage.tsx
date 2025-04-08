import L from 'leaflet'; // Lはleafletｸﾞﾛｰﾊﾞﾙｵﾌﾞｼﾞｪｸﾄ
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import '../../node_modules/leaflet/dist/leaflet.css'; // 追加
import { useAtom, useAtomValue } from 'jotai';
import { latitudeAtom, longitudeAtom, manualLatitudeAtom, manualLongitudeAtom, watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { CenterMapButton } from './CenterMapButton';
import { ToHomeButton } from './ToHomeButton';
import { AutoFlyTo } from './AutoFlyTo';
import { CurrentCoordinate } from './CurrentCoordinate';

import { useGeoWatcher } from './useGeoWatcher';
import { useEffect } from 'react';

const DefaultIcon = L.icon({ // .iconｶｽﾀﾑｱｲｺﾝ作成のｸﾗｽ
  iconUrl: markerIcon, // iconとして表示する画像のURL
  shadowUrl: markerShadow, // ﾏｰｶｰに影を表示する場合その影のURL
  iconSize: [25, 41], // ｱｲｺﾝ画像の幅と高さﾋﾟｸｾﾙ単位
  iconAnchor: [12, 41], // ｱｲｺﾝ画像のどの点が地図上の座標と一致するか ﾋﾟｸｾﾙ単位
  popupAnchor: [1, -34], // ﾎﾟｯﾌﾟｱｯﾌﾟｳｨﾝﾄﾞｳがｱｲｺﾝ画像からどのくらい離れるか
  shadowSize: [41, 41] // 影画像の幅と高さ
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapPage = () => {

  const latitude = useAtomValue(latitudeAtom);
  const longitude = useAtomValue(longitudeAtom);
  const [ watchedLatitude , setWatchedLatitude ] = useAtom(watchedLatitudeAtom);
  const [ watchedLongitude , setWatchedLongitude ] = useAtom(watchedLongitudeAtom);
  const manualLatitude = useAtomValue(manualLatitudeAtom);

  // 位置管理ロジック
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      console.log('watchのpositon値', position);
      if (manualLatitude === null) {
        setWatchedLatitude(position.coords.latitude);
        setWatchedLongitude(position.coords.longitude);
      }
    },
    (error) => console.error('watch位置情報取得エラー', error),
    { enableHighAccuracy: true }
  );
  return () => navigator.geolocation.clearWatch(watchId);
  }, [manualLatitude]);

  return (
    <>
      <MapContainer
        center={
          latitude && longitude ? [latitude, longitude] : [35.681641, 139.766921]
        }
        zoom={17}
        scrollWheelZoom={true} // scrollでzoom可
        zoomSnap={0.5} // zoomの段階調整
        style={{ height: '100vh', width: '100vw' }} // 追加
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          <CurrentCoordinate /> {/* 座標表示 */}
          {/* <CenterMapButton /> */}
           {/* 現在地に移動ボタン */}
          <ToHomeButton />
          <AutoFlyTo/> {/* 追従 */}
        <Marker
          key={`${latitude}-${longitude}`}
          position={
            latitude && longitude ? [latitude, longitude] : [35.681641, 139.766921]
          }
        >
          <Popup>
           現在地： <br /> {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
