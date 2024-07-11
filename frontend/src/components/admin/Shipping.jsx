import React, { useEffect } from "react";
import {
  useGetShippingQuery,
  useDeleteShippingMutation,
  useUpdateShippingMutation,
} from "../../redux/api/shippingApi";
import AdminLayout from "../layout/AdminLayout";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
export const Shipping = () => {
  const { data, isLoading, error } = useGetShippingQuery();
  const [
    deleteShipping,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteShippingMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Shipping Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const deleteShippingHandler = (id) => {
    deleteShipping(id);
  };

  const setShippings = () => {
    if (!data || !data.shipping || !Array.isArray(data.shipping)) {
      return { columns: [], rows: [] };
    }

    const shippings = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Code",
          field: "code",
          sort: "asc",
        },
        {
          label: "Description",
          field: "description",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: data.shipping.map((shipping) => ({
        name: shipping.name,
        description: shipping.description,
        code: shipping.code,
        price: shipping.price,
        actions: (
          <div>
            <button
              className="btn btn-outline-danger"
              onClick={() => deleteShippingHandler(shipping?._id)}
            >
              <i className="fa fa-trash"></i> Delete
            </button>
          </div>
        ),
      })),
    };

    return shippings;
  };

  const handleDelete = (voucherId) => {
    console.log(`Deleting voucher with ID: ${voucherId}`);
  };

  return (
    <AdminLayout>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <h1 className="my-5">{data?.shipping?.length || 0} Shipping Unit</h1>
      <MDBDataTable
        data={setShippings()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default Shipping;
