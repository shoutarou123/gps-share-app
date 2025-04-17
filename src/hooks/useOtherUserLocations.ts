import { useEffect } from "react";
import { GetUserDataId } from "../../lib/authUser";
import { supabase } from "../../utils/supabase";
import { useAtom } from "jotai";
import { otherUserLocationAtom } from "../compornents/Atom";

export const useOtherUserLocations = () => {
const [otherUserLocations, setOtherUserLocations] = useAtom(otherUserLocationAtom)

  useEffect(() => {
    const fetchOtherUserLocation = async (): Promise<any> => {
      const currentUserId = await GetUserDataId();
      if (currentUserId) {
        const { data, error } = await supabase
          .rpc('get_other_user_location_data', {current_user_id: currentUserId})
        if (error) {
          console.error('エラー', error.message)
        } else {
          if (data) {
            const formattd = data.map((locationData) => ({
              id: locationData.id,
              name: locationData.name,
              longitude: locationData.longitude,
              latitude: locationData.latitude
            }));
            setOtherUserLocations(formattd);
          } else {
            console.log('他のユーザーのデータがありません');
          }
        }
      }
    }
    fetchOtherUserLocation();
  }, []);
  return otherUserLocations;
};

