import { PropsWithChildren } from "react"

export const BackgroundImage = ({children}: PropsWithChildren) => {
  return (
    <>
      <div className="
        bg-[url('/design/wa2.jpg')]
        bg-cover
        h-screen
        flex
        items-center
        justify-center
    ">
      {children}
      </div>
    </>
  )
}
