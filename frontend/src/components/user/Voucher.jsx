import React, { useState } from "react";
import MetaData from "../layout/MetaData";
import { useGetVoucherQuery } from "../../redux/api/voucherApi";

const Voucher = ({ setVoucher }) => {
  const { data, isLoading, error } = useGetVoucherQuery();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const vouchers = data?.voucher || [];

  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher);
    setVoucher(voucher); // Update voucher in parent component
    console.log("Voucher selected:", voucher);
  };

  return (
    <>
      <MetaData title={"Voucher"} />
      <div>
        <h1>Danh sách voucher </h1>
        <span className="text-danger">{`Lưu ý: không áp dụng với thanh toán bằng thẻ`}</span>
      </div>
      <div className="row">
        {vouchers.map((voucher) => (
          <div
            key={voucher._id}
            className="col-sm-12 col-md-6 col-lg-3 my-3"
            onClick={() => handleVoucherClick(voucher)}
            style={{ cursor: "pointer" }}
          >
            <div
              className={`card p-3 rounded voucher-card ${
                selectedVoucher?._id === voucher._id
                  ? "border border-primary"
                  : ""
              }`}
            >
              <div className="card-body ps-3 d-flex justify-content-center flex-column">
                <p className="voucher-title">Tên: {voucher.name}</p>
                <p className="voucher-discount">{`Giảm giá: ${voucher.discount} %`}</p>
                <p className="voucher-quantity">Số lượng: {voucher.quantity}</p>
                <p className="voucher-description">
                  Mô tả: {voucher.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
  <style jsx>{`
    .voucher-card {
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .voucher-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .voucher-title {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .voucher-discount {
      color: #dc3545;
      font-size: 1.1rem;
    }
    .voucher-quantity {
      font-size: 1rem;
      color: #6c757d;
    }
    .voucher-description {
      font-size: 0.9rem;
      color: #6c757d;
    }
  `}</style>;
};

export default Voucher;
