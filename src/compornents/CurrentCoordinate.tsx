import { useAtomValue } from 'jotai'
import React from 'react'
import { latitudeAtom, longitudeAtom } from './Atom'

export const CurrentCoordinate = () => {
  const latitude = useAtomValue(latitudeAtom);
  const loingitude = useAtomValue(longitudeAtom);
  return (
    <>
      <h1 className='text-lg bg-white absolute z-[1000] border border-blue-500 ml-15 mt-3'>緯度 {latitude}</h1>
      <h1 className='text-lg bg-white absolute z-[1000] border border-blue-500 ml-15 mt-13'>経度 {loingitude}</h1>
    </>
  )
}

