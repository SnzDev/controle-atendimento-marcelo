import { QrCode, X } from "lucide-react";
import { useDiscloseSelect } from "~/hooks";
import { type DiscloseSelect } from "~/hooks/useDiscloseSelect";
import { QRCodeSVG } from "qrcode.react";
import { Loading } from "~/components/Loading";
import Swal from "sweetalert2";
import { type StatusInstance } from "@acme/db";

interface ButtonQrCodeProps {
  qrCode?: string | null;
}
const ButtonQrCode = ({ qrCode }: ButtonQrCodeProps) => {
  const disclose = useDiscloseSelect();
  return (<>
    <button
      onClick={async () => {
        if (qrCode) return disclose.onOpen();

        await Swal.fire({
          title: 'Ops!',
          text: 'Ainda estamos capturando o QrCode!',
          icon: 'warning',
        })
      }}
      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ">
      <QrCode />
    </button>

    <ModalQrCode qrCode={qrCode} disclose={disclose} />
  </>)
}


//create a simple modal to show qr-code

interface ModalQrCodeProps {
  disclose: DiscloseSelect;
  qrCode?: string | null;
}
const ModalQrCode = ({ disclose, qrCode }: ModalQrCodeProps) => {
  if (!disclose.isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center">
        <div ref={disclose.ref} className="bg-white dark:bg-slate-600 min-h-[20.6rem] min-w-[40.2rem] rounded-lg shadow-md dark:shadow-slate-600">
          <div id="header">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 dark:border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">QR Code</h2>
              <button
                onClick={disclose.onClose}
                className="p-1 rounded-lg hover:scale-125 placeholder:text-slate-700 hover:text-slate-800  dark:text-white   hover:bg-gray-300 transition-all ">
                <X />
              </button>
            </div>

            <div id="content">

              <div className="flex items-center justify-center p-6 h-full">

                {qrCode && <div className="p-2 rounded-lg bg-white"><QRCodeSVG className="w-[20rem] h-[20rem]" value={qrCode} /></div>}
                {!qrCode && <p className="text-lg text-white">WhatsApp Conectado!</p>}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );


}

export { ButtonQrCode };

