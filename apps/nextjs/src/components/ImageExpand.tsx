import { X } from "lucide-react";
import useDiscloseSelect from "~/hooks/useDiscloseSelect";
import { Portal } from "./Portal";
import Image from "next/image";


type ImageExpandProps = {
  imageUrl: string;
  children: React.ReactNode;
}
export const ImageExpand = ({ imageUrl, children }: ImageExpandProps) => {
  const disclose = useDiscloseSelect();

  return <>
    <button onClick={disclose.onOpen} >
      {children}
    </button>
    {disclose.isVisible &&
      <div className="fixed inset-0 z-[1300] flex items-center backdrop-blur-sm bg-black justify-center w-screen h-screen bg-gray-900 bg-opacity-60">
        <div ref={disclose.ref} className=" h-fit w-fit  flex flex-col justify-center items-center  shadow-md ">
          <Image src={imageUrl} alt='image' className="rounded-md" width={500} height={500} />
        </div>
      </div>
    }
  </>
}

type GifVideoExpandProps = {
  videoUrl: string;
  mimeType?: string;
  children: React.ReactNode;
}
export const GifVideoExpand = ({ videoUrl, children, mimeType = "application/mp4" }: GifVideoExpandProps) => {

  const disclose = useDiscloseSelect();

  return <>
    <button onClick={disclose.onOpen} >
      {children}
    </button>
    {disclose.isVisible &&
      <div className="fixed inset-0 z-[1300] flex items-center backdrop-blur-sm justify-center w-screen h-screen bg-gray-900 bg-opacity-50">
        <div ref={disclose.ref} className=" h-fit w-fit  flex flex-col justify-center items-center  shadow-md ">
          <video width="500" height="500" autoPlay loop>
            <source src={videoUrl} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    }
  </>

}