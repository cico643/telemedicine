import React from "react";
import Image from "react-image-enlarger";

function ZoomableImage({ src }) {
  const [zoomed, setZoomed] = React.useState(false);

  return (
    <div style={{ margin: "5px" }}>
      <Image
        style={{ width: "100px", height: "auto" }}
        zoomed={zoomed}
        src={src}
        onClick={() => setZoomed(true)}
        onRequestClose={() => setZoomed(false)}
      />
    </div>
  );
}

export default ZoomableImage;
