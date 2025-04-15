import { useEffect } from "react";
import { GetUserData } from "../../lib/authUser";
import { supabase } from "../../utils/supabase";
import { useAtom } from "jotai";
import { otherUserLocationAtom } from "../compornents/Atom";


export const useOtherUserLocations = () => {
const [otherUserLocations, setOtherUserLocations] = useAtom(otherUserLocationAtom)

  useEffect(() => {
    const fetchOtherUserLocation = async (): Promise<any> => {
      const currentUserId = await GetUserData();
      if (currentUserId) {
        const { data, error } = await supabase
          .rpc('get_user_location_data')

        if (error) {
          console.error('エラー', error.message)
        } else {
          const formattd = data.map((locationData) => ({
            id: locationData.id,
            longitude: locationData.longitude,
            latitude: locationData.latitude
          }));
          setOtherUserLocations(formattd);
        }
      }
    }
    fetchOtherUserLocation();
  }, []);
  return otherUserLocations;
};
