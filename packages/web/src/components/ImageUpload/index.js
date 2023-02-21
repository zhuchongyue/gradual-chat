import React from "react";
import ReactDOM from "react-dom";
import ImageUpload from "./ImageUpload";

import "./styles.css";

/*function UI() {
  return (
    <div className="App">
      <ImageUploadCard cardName="Image 1" />
    </div>
  );
}*/
const galleryImageList = [
  "https://raw.githubusercontent.com/dxyang/StyleTransfer/master/style_imgs/mosaic.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dora-maar-picasso.jpg",
  "https://pbs.twimg.com/profile_images/925531519858257920/IyYLHp-u_400x400.jpg",
  "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dog.jpg",
  "http://r.ddmcdn.com/s_f/o_1/cx_462/cy_245/cw_1349/ch_1349/w_720/APL/uploads/2015/06/caturday-shutterstock_149320799.jpg"
];
//const rootElement = document.getElementById("root");
ReactDOM.render(
  <ImageUpload cardName="Input Image" imageGallery={galleryImageList} />,
  document.querySelector("#root")
);
//ReactDOM.render(<App />, document.querySelector('#root'));
