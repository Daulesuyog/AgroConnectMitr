import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR code scanned:", decodedText);
        onScanSuccess(decodedText);
        scanner.clear(); // Stop after 1 scan
      },
      (error) => {
         console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("QR clear error:", err));
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" style={{ width: "100%" }} />;
}

export default QRScanner;
