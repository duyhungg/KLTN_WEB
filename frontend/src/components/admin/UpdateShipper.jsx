import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import {
  useAddShipperMutation,
  useGetShippingQuery,
} from "../../redux/api/shippingApi";

const UpdateShipper = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [shippingUnit, setShippingUnit] = useState("");
  const { data: dataShipping, isLoading: shippingLoading } =
    useGetShippingQuery();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading: userDetailsLoading } = useGetUserDetailsQuery(
    params?.id
  );
  const [addShipper, { error, isSuccess }] = useAddShipperMutation();

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("User Updated");
      navigate("/admin/shipper");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!data?.user) {
      toast.error("User data is not available yet.");
      return;
    }

    const userData = {
      user: data.user._id,
      shippingUnit: {
        shippingUnitId: shippingUnit,
      },
    };
    console.log("shipper", userData);
    addShipper(userData);
  };

  if (userDetailsLoading || shippingLoading) {
    return <Loader />;
  }

  return (
    <AdminLayout>
      <MetaData title={"Update User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h2 className="mb-4">Update User</h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                Name
              </label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role_field" className="form-label">
                ShippingUnit
              </label>
              <select
                id="role_field"
                className="form-select"
                name="role"
                value={shippingUnit}
                onChange={(e) => setShippingUnit(e.target.value)}
              >
                {dataShipping?.shipping &&
                  dataShipping?.shipping.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.code}
                    </option>
                  ))}
              </select>
            </div>
            <button type="submit" className="btn update-btn w-100 py-2">
              Update
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateShipper;
