import { QRCodeCanvas } from 'qrcode.react'
import './LocationQR.css'

const LOCATION_URL =
  'https://maps.app.goo.gl/xtXjhpiR2Vm6PnAk6'

export default function LocationQR() {
  return (
    <div className="location-qr">

      <div className="location-qr-content">

        <span className="location-qr-label">
          SCAN FOR LOCATION
        </span>

        <div className="location-qr-box">

          <QRCodeCanvas
            value={LOCATION_URL}
            size={720}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/BlackLogo2.png',
              width: 150,
              height: 150,
              excavate: true,
            }}
          />

        </div>

      </div>

    </div>
  )
}