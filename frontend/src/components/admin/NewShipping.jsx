import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";

import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useCreateShippingMutation } from "../../redux/api/shippingApi";
const NewShipping = () => {
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    name: "",
    description: "",
    code: "",
    price: "",
  });
  const { name, description, code, price } = shipping;

  const [createShipping, { isLoading, error, isSuccess }] =
    useCreateShippingMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Shipping created");
      navigate("/admin/shipping");
    }
  }, [error, isSuccess]);

  const onChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createShipping(shipping);
  };

  return (
    <AdminLayout>
      <MetaData title={"Create new Shipping"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">New ShippingUnit</h2>
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
            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="price_field" className="form-label">
                  {" "}
                  Code{" "}
                </label>
                <input
                  type="text"
                  id="code_field"
                  className="form-control"
                  name="code"
                  value={code}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="stock_field" className="form-label">
                  {" "}
                  Price{" "}
                </label>
                <input
                  type="number"
                  id="price_field"
                  className="form-control"
                  name="price"
                  value={price}
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

export default NewShipping;
