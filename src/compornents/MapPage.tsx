import { useEffect} from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { ToastContainer } from 'react-toastify';
import { supabase, supabaseUrl } from '../../utils/supabase';

import { useAtom, useAtomValue } from 'jotai';
import { latitudeAtom, locationAtom, longitudeAtom, mergePostDataAtom, PostLocation, watchedLatitudeAtom, watchedLongitudeAtom } from './Atom';

import L from 'leaflet'; // Lはleafletｸﾞﾛｰﾊﾞﾙｵﾌﾞｼﾞｪｸﾄ
import '../../node_modules/leaflet/dist/leaflet.css';

import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'

import { CenterMapButton } from './CenterMapButton';
import { ToHomeButton } from './ToHomeButton';
import { CurrentCoordinate } from './CurrentCoordinate';
import { AutoFollow } from './AutoFollow';

import { useOtherUserLocations } from '../hooks/useOtherUserLocations';
import { useGeoWatcher } from './useGeoWatcher';

const greenIcon = L.icon({ // .iconｶｽﾀﾑｱｲｺﾝ作成のｸﾗｽ
  iconUrl: '/leaflet/pngwing.com.png', // iconとして表示する画像のURL
  shadowUrl: markerShadow, // ﾏｰｶｰに影を表示する場合その影のURL
  iconSize: [50, 41], // ｱｲｺﾝ画像の幅と高さﾋﾟｸｾﾙ単位
  iconAnchor: [12, 41], // ｱｲｺﾝ画像のどの点が地図上の座標と一致するか ﾋﾟｸｾﾙ単位
  popupAnchor: [1, -40], // ﾎﾟｯﾌﾟｱｯﾌﾟｳｨﾝﾄﾞｳがｱｲｺﾝ画像からどのくらい離れるか
  shadowSize: [41, 41], // 影画像の幅と高さ
});

const otherIcon = L.icon({
  iconUrl: '/leaflet/marker-256.png',
  shadowUrl: markerShadow,
  iconSize: [51, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
})

const DefaultIcon = L.icon({ // .iconｶｽﾀﾑｱｲｺﾝ作成のｸﾗｽ
  iconUrl: markerIcon, // iconとして表示する画像のURL
  shadowUrl: markerShadow, // ﾏｰｶｰに影を表示する場合その影のURL
  iconSize: [25, 41], // ｱｲｺﾝ画像の幅と高さﾋﾟｸｾﾙ単位
  iconAnchor: [12, 41], // ｱｲｺﾝ画像のどの点が地図上の座標と一致するか ﾋﾟｸｾﾙ単位
  popupAnchor: [1, -34], // ﾎﾟｯﾌﾟｱｯﾌﾟｳｨﾝﾄﾞｳがｱｲｺﾝ画像からどのくらい離れるか
  shadowSize: [41, 41] // 影画像の幅と高さ
});

export const MapPage = () => {
  useGeoWatcher();
  const otherUserLocations = useOtherUserLocations()
  const latitude = useAtomValue(latitudeAtom);
  const longitude = useAtomValue(longitudeAtom);
  const watchedLatitude = useAtomValue(watchedLatitudeAtom);
  const watchedLongitude = useAtomValue(watchedLongitudeAtom);
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
          setMergePostData(postsIdMergeLocIdData);
        }

      } catch (error) {
        console.error('データ取得失敗', error);
      }
    };
    fetchData();
  }, [otherUserLocations]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <MapContainer
        center={
          watchedLatitude && watchedLongitude ? [watchedLatitude, watchedLongitude] : [35.681641, 139.766921]
        }
        zoom={17}
        scrollWheelZoom={true} // scrollでzoom可
        zoomSnap={0.5} // zoomの段階調整
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CurrentCoordinate /> {/* 座標表示 */}
        <CenterMapButton /> {/* 現在地に移動ボタン */}
        <ToHomeButton /> {/* Homeに戻るボタン */}
        <AutoFollow />  {/* 追従 */}

        {/* 投稿マーカー */}
        {mergePostData?.map((mergePost) => {
          return (<Marker
            key={mergePost.post_id}
            position={[mergePost.latitude, mergePost.longitude]}
            icon={greenIcon}
          >
            <Popup>
              <div className='mb-2'>
                {mergePost.title}
              </div>
              {mergePost.image_url ?
                <>
                  <div className='w-[300px]'>
                    <a
                      href={mergePost.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <img
                        src={mergePost.image_url ?? ''}
                        alt={`${mergePost.title}の画像`}
                        className='w-full h-auto'
                      />
                    </a>
                  </div>
                  <div className='flex justify-center mt-2'>

                  </div>
                </>
                :
                <span></span>
              }
            </Popup>
          </Marker>)
        })}

        {/* 他のユーザー用マーカー */}
        {otherUserLocations?.filter((user) => user.latitude !== null && user.longitude !== null)
          .map((otherUser) => {
            return (
              <Marker
                key={`${otherUser.id}`}
                position={
                  [otherUser.latitude, otherUser.longitude]
                }
                icon={otherIcon}
              >
                <Popup>{otherUser.name}</Popup>
              </Marker>
            )
          })}

        {/* ログインユーザー用マーカー */}
        <Marker
          key={`${watchedLatitude}-${watchedLongitude}`}
          position={
            watchedLatitude && watchedLongitude ? [watchedLatitude, watchedLongitude] : [35.681641, 139.766921]
          }
          icon={DefaultIcon}
        >
          <Popup>
            現在地： <br /> {watchedLatitude?.toFixed(6)}, {watchedLongitude?.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
