import { ChangeEventHandler, useRef } from "react";

export const useHooks = () => {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (!files || files?.length === 0) return; // filesがnull,undefinedの時にfilesが空だったらﾘﾀｰﾝを返す
    const file = files[0]; // 最初のﾌｧｲﾙを表示
    console.log('fileの中身', file);
    
    const imageContainer = imageContainerRef.current; // <div> を取得
    console.log('imageContainerの中身', imageContainer);

    if (!imageContainer) return; // imageContainerが存在しない場合は処理を中断

   
    imageContainer.innerHTML = ''; //  既存画像クリア
    console.log('クリア後のimageContainer.innerHTMLの中身', imageContainer);

    // 新しい画像生成
    const fileImage = new Image()
    
    fileImage.src = window.URL.createObjectURL(file); // 一時的なURL作成
    imageContainer.appendChild(fileImage); // <div>の末尾に表示
    fileImage.onload = () => { // URLの読み込みが完了したら
      window.URL.revokeObjectURL(fileImage.src) // ﾒﾓﾘ消費しないようfileImage.srcを解放する これは値は残るが再度このURLを利用しようとするとｴﾗｰにさせるもの
      console.log("fileImage.srcの中身", fileImage.src); // 値は表示される
    }; 
  };
  return { handleFiles, imageContainerRef };
};