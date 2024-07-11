import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <div className="Footer bg-footer">
        <div className="container text-white">
          <div className="row">
            <div className="col-md-6 col-lg-4 col-12 ft-1">
              <div className="navbar-brand ">
                <img
                  src="/images/logo.png"
                  alt="EcStore Logo"
                  className="w-25 h-25"
                ></img>
              </div>
              <p className="text-white">
                Trang Web bán hàng điện tử số 1 Việt Nam chuyên cung cấp tất cả
                mọi thứ liên quan đến công nghệ giá rẻ nhất thị trường
              </p>
              <div className="footer-icons">
                <span className="">
                  <FaFacebook size={35} />
                </span>
                <span className="">
                  <FaInstagram size={35} />
                </span>
                <span className="">
                  <FaGithub size={35} />
                </span>
                <span className="">
                  <FaYoutube size={35} />
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-12 ft-2">
              <h5>Hỗ Trợ khách hàng</h5>
              <ul className="text-white">
                <li className="nav-item">
                  <a className="" href="/">
                    Hướng dẫn mua hàng online{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Điều kiện giao dịch chung
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Chính sách giao hàng
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Hướng dẫn thanh toán
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Chính sách bảo hành đổi & trả
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-3 col-12 ft-3">
              <h5>Về EcStore</h5>
              <ul className="text-white">
                <li className="nav-item">
                  <a className="" href="/">
                    Tin tuyển dụng
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Câu chuyện về EcStore
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/">
                    Danh mục sản phẩm
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-2 col-12 ft-4 gap-2">
              <h5>Thông tin liên lạc</h5>
              <ul className="text-white">
                <li className="nav-item">
                  <span className="" href="/">
                    Email:dongocduyhung7@gmail.com
                  </span>
                </li>
                <li className="nav-item">
                  <span className="" href="/">
                    SĐT: 0382771941
                  </span>
                </li>
                <li className="nav-item">
                  <span className="" href="/">
                    Địa chỉ: Số 1 Võ Văn Ngân, Thủ Đức
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
