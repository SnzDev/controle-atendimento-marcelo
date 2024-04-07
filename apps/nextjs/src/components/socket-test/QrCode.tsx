import { QRCodeSVG } from 'qrcode.react';

type QrCodeProps = {
  qr: string[];
}

export function QrCode({ qr }: QrCodeProps) {
  const qrCode = !!qr.length ? qr[qr.length - 1] : null;


  return (
    <ul className="list-disc list-inside space-y-2">

      {qrCode && <QRCodeSVG className="w-[20rem] h-[20rem]" value={qrCode} />}

    </ul>
  );
}