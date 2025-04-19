import { atom } from "jotai";
import { Post } from "../domain/post";
import { User } from "../domain/user";

// ユーザー登録情報管理用atom
export const userRegisterAtom = atom<User | null>(null);

// Loading...を表示するatom
export const loadingAtom = atom<boolean>(false);

// 投稿登録管理atom
export const postAtom = atom<Post[]>([]);
export const postTitleAtom = atom<string>("");
export const postContentAtom = atom<string | null>(null);
export const uploadImageAtom = atom<File | null>(null);
export const previewImgAtom = atom<string | null>(null);
export const uploadMovieAtom = atom<File | null>(null);
export const previewMovieAtom = atom<string | null>(null);

// 緯度経度取得atom
export const latitudeAtom = atom<number | null>(null);
export const longitudeAtom = atom<number | null>(null);


// 位置情報監視watch用atom
export const watchedLatitudeAtom = atom<number | null>(null);
export const watchedLongitudeAtom = atom<number | null>(null);

// 現在地に戻るボタン 手動操作用atom
// export const manualLatitudeAtom = atom<number | null>(null);
// export const manualLongitudeAtom = atom<number | null>(null);

// 優先順位付きatom 手動が優先 次に監視用watch
// export const rankLatitudeAtom = atom<number | null>((get) => {
// return get(manualLatitudeAtom) ?? get(watchedLatitudeAtom);
// });

// export const rankLongitudeAtom = atom<number | null>((get) => {
// return get(manualLongitudeAtom) ?? get(watchedLongitudeAtom);
// });

export type PostLocation = {
  post_id: number;
  latitude: number;
  longitude: number;
};
// mapで表示する投稿データ管理用atom
export const locationAtom = atom<PostLocation[]>([]);

// export const postsLatAtom = atom<number | null>(null);
// export const postsLonAtom = atom<number | null>(null);

export type mergePostData = {
  title: string | undefined;
  image_url: string | null,
  post_id: number;
  latitude: number;
  longitude: number;
};

export const mergePostDataAtom = atom<mergePostData[]>([]);

// 他のユーザーのusers_locationの中身保管用atom
export type otherUserLocationData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const otherUserLocationAtom = atom<otherUserLocationData[]>([]);

// ログイン trure/false管理用
export const loginAtom = atom(false);

// ページネーション最初の数字の管理用
export const itemsOffsetAtom = atom<number>(0);
