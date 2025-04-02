import { atom } from "jotai";
import { Post } from "../domain/post";

// 緯度経度取得atom
export const latitudeAtom = atom<number | null>(null);
export const longitudeAtom = atom<number | null>(null);

// Loading...を表示するatom
export const loadingAtom = atom<boolean>(false);

// 投稿登録管理atom
export const postAtom = atom<Post[]>([]);
export const postTitleAtom = atom<string>("");
export const postContentAtom = atom<string>("");
export const uploadImageAtom = atom<File | null>(null);
export const previewImgAtom = atom<string | undefined>("");
