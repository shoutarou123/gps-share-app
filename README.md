useFormのwatchは使い方によって再レンダリングすることになる。リアルタイムで監視できるが、そのようなデメリットもある。
getValuesによってvalidateを設定するのはリアルタイム監視はできず、送信時にのみにチェックすることにより再レンダリングを防止できる。

// register("confirmPassword") の "confirmPassword" は、React Hook Form におけるデータ管理の名前（フォームのデータ構造を決める）。
// 異なっていても問題ないし、統一しても良い（ただし、register の値は一意にする必要がある）。