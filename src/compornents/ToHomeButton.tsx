import { useNavigate } from 'react-router'

export const ToHomeButton = () => {
  const navigate=useNavigate();
  return (
    <button
      className='border border-blue-500 bg-blue-500  text-white rounded absolute z-[1000] right-1 p-2 mt-20 mr-14 cursor-pointer hover:bg-blue-400 '
      onClick={() => navigate("/")}
    >
      Homeへ戻る
    </button>
  )
}

