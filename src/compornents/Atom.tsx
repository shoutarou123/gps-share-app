import { atom } from "jotai";

export const latitudeAtom = atom<number | null>(null);
export const longitudeAtom = atom<number | null>(null);

export const loadingAtom = atom<boolean>(false);