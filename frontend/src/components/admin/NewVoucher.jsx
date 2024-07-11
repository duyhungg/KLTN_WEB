import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useCreateVoucherMutation } from "../../redux/api/voucherApi";
const NewVoucher = () => {
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState({
    name: "",
    description: "",
    deliveryFee: "",
    discount: "",
    quantity: "",
  });
  const { name, description, deliveryFee, discount, quantity } = voucher;

  const [createVoucher, { isLoading, error, isSuccess }] =
    useCreateVoucherMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Voucher created");
      navigate("/admin/voucher");
    }
  }, [error, isSuccess]);

  const onChange = (e) => {
    setVoucher({ ...voucher, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createVoucher(voucher);
  };

  return (
    <AdminLayout>
      <MetaData title={"Create new Voucher"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">New Voucher</h2>
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                {" "}
                Name{" "}
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                {" "}
                Description{" "}
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="description"
                value={description}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                {" "}
                DeliveryFee{" "}
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="deliveryFee"
                value={deliveryFee}
                onChange={onChange}
              />
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="price_field" className="form-label">
                  {" "}
                  Discount{" "}
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  name="discount"
                  value={discount}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="stock_field" className="form-label">
                  {" "}
                  Quantity{" "}
                </label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  name="quantity"
                  value={quantity}
                  onChange={onChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "CREATE"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewVoucher;
