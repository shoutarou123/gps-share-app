import L from 'leaflet'; // Lはleafletｸﾞﾛｰﾊﾞﾙｵﾌﾞｼﾞｪｸﾄ
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import '../../node_modules/leaflet/dist/leaflet.css'; // 追加
import { useAtom, useAtomValue } from 'jotai';
import { latitudeAtom, locationAtom, longitudeAtom, mergePostDataAtom, PostLocation, watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';
import { CenterMapButton } from './CenterMapButton';
import { ToHomeButton } from './ToHomeButton';
// import { AutoFlyTo } from './AutoFlyTo';
import { CurrentCoordinate } from './CurrentCoordinate';

import { useGeoWatcher } from './useGeoWatcher';
import { useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '../../utils/supabase';
import { data } from 'react-router';
import { Posts } from './posts';

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
  useGeoWatcher();
  const latitude = useAtomValue(latitudeAtom);
  const longitude = useAtomValue(longitudeAtom);
  const [watchedLatitude, setWatchedLatitude] = useAtom(watchedLatitudeAtom);
  const [watchedLongitude, setWatchedLongitude] = useAtom(watchedLongitudeAtom);
  const [locationData, setlocationData] = useAtom(locationAtom);
  const [mergePostData, setMergePostData] = useAtom(mergePostDataAtom);

  const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/post-images`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: coordinateData, error } = await supabase
          .rpc('get_all_post_coordinates')
        if (error) throw error;
        if (coordinateData) setlocationData(coordinateData as PostLocation[]);

        const { data: fetchPosts, error: errorPosts } = await supabase.from('posts').select("*");
        console.log('fetchPostsの値', fetchPosts);
        if (coordinateData && fetchPosts) {
          const postsIdMergeLocIdData = coordinateData.map((coordiData) => {
            const post = fetchPosts?.find(posts => posts.id === coordiData.post_id)
            return {
              ...coordiData,
              title: post?.title,
              image_url: `${SUPABASE_STORAGE_URL}/${post?.image_url}`
            }
          });
          console.log('postsIdMergeLocIdDataの値', postsIdMergeLocIdData);
          setMergePostData(postsIdMergeLocIdData);
        }

      } catch (error) {
        console.error('データ取得失敗', error);
      }
    };
    fetchData();
  }, []);
  // console.log('postsData',postsData);
  // 位置管理ロジック
  // useEffect(() => {
  //   const watchId = navigator.geolocation.watchPosition((position) => {
  //     console.log('watchのpositon値', position);
  //     if (manualLatitude === null) {
  //       setWatchedLatitude(position.coords.latitude);
  //       setWatchedLongitude(position.coords.longitude);
  //     }
  //   },
  //   (error) => console.error('watch位置情報取得エラー', error),
  //   { enableHighAccuracy: true }
  // );
  // return () => navigator.geolocation.clearWatch(watchId);
  // }, [manualLatitude]);

  return (
    <>
      <MapContainer
        center={
          watchedLatitude && watchedLongitude ? [watchedLatitude, watchedLongitude] : [35.681641, 139.766921]
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
        <CenterMapButton /> {/* 現在地に移動ボタン */}
        <ToHomeButton />
        {/* <AutoFlyTo/> */}
        {/* 追従 */}
        {mergePostData?.map((mergePost) => {
          return (<Marker
            key={mergePost.post_id}
            position={[mergePost.latitude, mergePost.longitude]}
          >
            <Popup>
              <div className='mb-2'>
              {mergePost.title}
              </div>
              {mergePost.image_url ?
                <img
                  src={mergePost.image_url ?? ''}
                  alt={`${mergePost.title}の画像`}
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                />
                :
                <span></span>
              }
            </Popup>
          </Marker>)
        })}
        <Marker
          key={`${watchedLatitude}-${watchedLongitude}`}
          position={
            watchedLatitude && watchedLongitude ? [watchedLatitude, watchedLongitude] : [35.681641, 139.766921]
          }
        >
          <Popup>
            現在地： <br /> {watchedLatitude?.toFixed(6)}, {watchedLongitude?.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
