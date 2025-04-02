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