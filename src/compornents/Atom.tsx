import { atom } from "jotai";
import { Post } from "../domain/post";

export const latitudeAtom = atom<number | null>(null);
export const longitudeAtom = atom<number | null>(null);

export const loadingAtom = atom<boolean>(false);

export const postAtom = atom<Post[]>([]);
export const postTitleAtom = atom<string>("");
export const postContentAtom = atom<string>("");
export const postImageAtom = atom<string | File | undefined>();
