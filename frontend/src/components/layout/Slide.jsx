import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from '../../assets/iphone.png'
import slider2 from "../../assets/ipad.png"
import slider3 from "../../assets/macbook.png"
import slider4 from "../../assets/case.png"
import slider5 from "../../assets/airpod.png"
const Slide = () => {
    const slider = [slider1,slider2,slider3,slider4,slider5]
  return (
    <div className="slider w-100">
  <div id="slider" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      {slider.map((item, index) => (
        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
          <img
            src={item}
            className="d-block "
            style={{ maxWidth: '1300px', height: '360px', objectFit: 'contain' }}
            alt="item"
          />
        </div>
      ))}
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#slider" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#slider" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</div>

  )
}

export default Slide
