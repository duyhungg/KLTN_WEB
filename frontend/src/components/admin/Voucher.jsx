import React, { useEffect } from "react";
import {
  useGetVoucherQuery,
  useDeleteVoucherMutation,
} from "../../redux/api/voucherApi";
import AdminLayout from "../layout/AdminLayout";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
export const Voucher = () => {
  const { data, isLoading, error } = useGetVoucherQuery();
  const [
    deleteVoucher,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteVoucherMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Voucher Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const deleteVoucherHandler = (id) => {
    deleteVoucher(id);
  };

  const setVouchers = () => {
    if (!data || !data.voucher || !Array.isArray(data.voucher)) {
      return { columns: [], rows: [] };
    }

    const vouchers = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Description",
          field: "description",
          sort: "asc",
        },
        {
          label: "Quantity",
          field: "quantity",
          sort: "asc",
        },
        {
          label: "Discount",
          field: "discount",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: data.voucher.map((voucher) => ({
        name: voucher.name,
        description: voucher.description,
        quantity: voucher.quantity,
        discount: voucher.discount,
        actions: (
          <div>
            <button
              className="btn btn-outline-danger"
              onClick={() => deleteVoucherHandler(voucher?._id)}
            >
              <i className="fa fa-trash"></i> Delete
            </button>
          </div>
        ),
      })),
    };

    return vouchers;
  };

  const handleDelete = (voucherId) => {
    // Implement delete logic here, e.g., calling an API
    console.log(`Deleting voucher with ID: ${voucherId}`);
  };

  return (
    <AdminLayout>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <h1 className="my-5">{data?.voucher?.length || 0} Vouchers</h1>
      <MDBDataTable
        data={setVouchers()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default Voucher;
