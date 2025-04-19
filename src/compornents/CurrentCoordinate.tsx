import { useAtomValue } from 'jotai'
import { watchedLatitudeAtom, watchedLongitudeAtom } from './Atom'

export const CurrentCoordinate = () => {
  const latitude = useAtomValue(watchedLatitudeAtom);
  const loingitude = useAtomValue(watchedLongitudeAtom);

  return (
    <>
      <h1
        className='
        text-lg
        bg-white
        absolute z-[1000]
        border border-blue-500
        ml-15 mt-3
        '
      >
        緯度 {latitude?.toFixed(6)}
      </h1>
      <h1
        className='
        text-lg
        bg-white
        absolute z-[1000]
        border border-blue-500
        ml-15 mt-13
        '
      >
        経度 {loingitude?.toFixed(6)}
      </h1>
    </>
  )
}

