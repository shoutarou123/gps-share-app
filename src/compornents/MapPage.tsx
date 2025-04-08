import L from 'leaflet'; // Lはleafletｸﾞﾛｰﾊﾞﾙｵﾌﾞｼﾞｪｸﾄ
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import '../../node_modules/leaflet/dist/leaflet.css'; // 追加
import { useAtomValue } from 'jotai';
import { latitudeAtom, longitudeAtom } from './Atom';
import { CenterMapButton } from './CenterMapButton';
import { ToHomeButton } from './ToHomeButton';
import { AutoFlyTo } from './AutoFlyTo';


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

  return (
    <>
    <h1>{latitude}</h1>
    <h1>{longitude}</h1>
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
          <CenterMapButton />
          <ToHomeButton />
          <AutoFlyTo />
        <Marker
          position={
            latitude && longitude ? [latitude, longitude] : [35.681641, 139.766921]
          }
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
