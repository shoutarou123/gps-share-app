useFormのwatchは使い方によって再レンダリングすることになる。リアルタイムで監視できるが、そのようなデメリットもある。
getValuesによってvalidateを設定するのはリアルタイム監視はできず、送信時にのみにチェックすることにより再レンダリングを防止できる。

// register("confirmPassword") の "confirmPassword" は、React Hook Form におけるデータ管理の名前（フォームのデータ構造を決める）。
// 異なっていても問題ないし、統一しても良い（ただし、register の値は一意にする必要がある）。


画像ファイルを外部ストレージに保存し、そのURLをデータベースに保存する場合、imageプロパティの型はstringで、データベースのカラムの型はTEXTになります。

この方法では、画像ファイル自体は外部ストレージに保存され、データベースには画像ファイルのURLが保存されるため、string型で十分です。TEXT型は、画像URLを保存するために適切なデータ型です。

以下にまとめます。

画像ファイルの保存方法: 外部ストレージ（例: Supabaseのストレージ）に保存。

データベースのカラム型: TEXT。

画像プロパティの型: string。

この方法は、画像ファイルを効率的に管理し、データベースのサイズを小さく保つために一般的に使用されています。

hook.js:608 Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at GeolocationFetch (GeolocationFetch.tsx:6:20)
    at App (App.tsx:27:29)



Geolocation permission has been blocked as the user has dismissed the permission prompt several times. This can be reset in Page Info which can be accessed by clicking the tune icon next to the URL. See https://www.chromestatus.com/feature/6443143280984064 for more information.


useEffect(() => {
  return () => { /* アンマウント時のみ実行 */ };
}, []);

<!--
補足: ファイル名のサニタイズ
元のファイル名には特殊文字やスペースなどが含まれる場合があります。これらはストレージで問題を引き起こす可能性があります。そのため、サニタイズ（不要な文字列を除去）することも推奨されます。

サニタイズ例
javascript
const sanitizedFileName = newImg.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // 特殊文字を除去
const fileName = `${Date.now()}-${sanitizedFileName}`;
-->

<!--
Supabase Storageにアップロードされたファイルは、デフォルトではプライベートに設定されています。そのため、直接的なアクセスができません。しかし、getPublicUrlメソッドを使用して公開用URLを取得することで、誰でもその画像にアクセスできるようになります。これにより、アプリケーション内で画像を表示したり、他のユーザーと共有することが可能になります。
取得した公開用URL（例: https://your-supabase-url/storage/v1/object/public/post-images/example.jpg）は、Reactコンポーネント内で画像のsrc属性として使用されます。このURLを利用することで、アップロードされた画像をプレビューや投稿一覧などのUI上に表示できます。
公開用URLはSupabaseのデータベース（postsテーブル）に保存されます。これにより、後で投稿データを取得した際、その画像を再度表示することができます。例えば、投稿一覧や詳細ページで画像が必要な場合、このURLを使って簡単に表示できます。
 -->

 useEffect(() => {
    return () => {
      if (typeof previewImg === 'string') {
        window.URL.revokeObjectURL(previewImg); // URLを解放する
      }
    };
  }, [previewImg]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadImg(e.target.files[0]); // Fileｵﾌﾞｼﾞｪｸﾄをset関数へ渡す
      setPreviewImg(window.URL.createObjectURL(e.target.files[0]));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!uploadImg) {
        alert('画像を選択してください');
        return;
      }

      const uploadFile = `${Date.now()}-${uploadImg.name}`; 
      console.log('uploadFileの中身', uploadFile);

      // Supabase Storage に画像をアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage // supabaseのstorageにｱｯﾌﾟﾛｰﾄﾞする、その後dataとerrorを取得
        .from('post-images')
        .upload(uploadFile, uploadImg);
      console.log('uploadDataの中身', uploadData);
if (uploadError) throw uploadError; // ｴﾗｰがあればｴﾗｰを投げる


 const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadResult.data.path); // 。 それが実際の公開URL（例: https://your-supabase-url/storage/v1/object/public/post-images/example.jpg）です。
      console.log('urlDataの中身', urlData);
      const imageUrl = urlData.publicUrl; // 沢山あるﾌﾟﾛﾊﾟﾃｨからpublicUrlを取出し代入
      
      const { error } = await supabase.from("posts").insert([
        {
          title: newTitle,
          content: newContent,
          image: imageUrl // storageのURLをdatabaseに保存
        },
      ]);

      if (error) throw error;

setPost((prevPosts) => {
        return [...prevPosts, { title: newTitle, content: newContent, img: imageUrl }]
      })

       setNewTitle('');
      setNewContent('');
      setPreviewImg(undefined);

      setUploadImg(null);

      alert('投稿が成功しました');

2025/04/06 Firebase 初期化を再度実施
