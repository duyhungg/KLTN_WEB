import React, { useState, useEffect } from "react";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { useGetShippingQuery } from "../../redux/api/shippingApi";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../redux/features/cartSlice";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const ShippingUnit = () => {
  const { data, isLoading, error } = useGetShippingQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const { address, city, phoneNo, zipCode, country } = shippingInfo;

  const handleChangePage = () => {
    dispatch(
      saveShippingInfo({ address, city, phoneNo, zipCode, country, shipping })
    );
    navigate("/confirm_order");
  };

  const [code, setCode] = useState();
  const [shippingUnit, setShippingUnit] = useState();
  const [selectedItemId, setSelectedItemId] = useState(null); // State để lưu id của item được chọn
  const [shipping, setShipping] = useState({
    shippingUnit,
    code,
  });

  const handleClick = (item) => {
    setCode(item.code);
    setShippingUnit(item._id);
    setSelectedItemId(item._id); // Cập nhật item được chọn
  };

  useEffect(() => {
    setShipping({
      shippingUnit,
      code,
    });
  }, [code, shippingUnit]);

  return (
    <>
      <MetaData title={"Shipping Info"} />
      <CheckoutSteps shipping shippingunit />
      <div className="row">
        {data &&
          data.shipping.map((item, index) => (
            <div
              key={index}
              className={`col-sm-12 col-md-6 col-lg-3 my-3 ${
                selectedItemId === item._id ? "selected" : ""
              }`}
              onClick={() => handleClick(item)}
            >
              <div className="card p-3 rounded">
                <div className="card-body ps-3 d-flex justify-content-center flex-column">
                  <p className="fs-1 font-bold large-font">{item.code}</p>
                  <p className="card-text">{item.name}</p>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">{item.price}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <button className="btn btn-primary flex " onClick={handleChangePage}>
        Next
      </button>

      <style jsx>{`
        .selected .card {
          background-color: rgba(0, 0, 0, 0.1);
          border: 2px solid;
        }
        .large-font {
          font-size: 2rem;
        }
      `}</style>
    </>
  );
};

export default ShippingUnit;
