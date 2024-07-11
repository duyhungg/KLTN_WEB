import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order  =>  /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    voucherInfo,
    shippingAmount,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    voucherInfo,
    user: req.user._id,
    shippingAmount: shippingAmount,
  });

  res.status(200).json({
    order,
  });
});

// Get current user orders  =>  /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

// Get order details  =>  /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

// Get all orders - ADMIN  =>  /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  });
});

// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  let productNotFound = false;

  // Update products stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      productNotFound = true;
      break;
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  if (productNotFound) {
    return next(
      new ErrorHandler("No Product found with one or more IDs.", 404)
    );
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});
// Delete order  =>  /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      // Stage 1 - Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      // Stage 2 - Group Data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 }, // count the number of orders
      },
    },
  ]);

  // Create a Map to store sales data and num of order by data
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  // Generate an array of dates between start & end Date
  const datesBetween = getDatesBetween(startDate, endDate);

  // Create final sales data array with 0 for dates without sales
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Get Sales Data  =>  /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate
  );

  res.status(200).json({
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});
// get order by status  =>  /api/v1/me/getOrderByStatus
export const getOrderByStatus = catchAsyncErrors(async (req, res, next) => {
  const status = req.params.status;
  const orders = await Order.find({ user: req.user._id, orderStatus: status });
  res.status(200).json({
    orders,
  });
});
// cancel order
export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus !== "NewOrder") {
    return next(new ErrorHandler("You can't Cancel Order", 400));
  }
  order.orderStatus = "Cancel";
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
});
// get datauser in year
export const getTotalAmountByMonth = catchAsyncErrors(
  async (req, res, next) => {
    const { year } = req.params;
    try {
      const monthlyTotalAmounts = [];

      for (let month = 1; month <= 12; month++) {
        const result = await Order.aggregate([
          {
            $match: {
              user: req.user._id,
              createdAt: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(`${year}-${month + 1}-01`),
              },
              orderStatus: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$totalAmount" },
            },
          },
        ]);
        if (result.length > 0) {
          monthlyTotalAmounts.push({
            month: month,
            totalAmount: result[0].totalAmount,
          });
        } else {
          monthlyTotalAmounts.push({
            month: month,
            totalAmount: 0,
          });
        }
      }

      res.status(200).json({ monthlyTotalAmounts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
//
// export const getDataCategory = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const allCategories = await Order.distinct("orderItems.category", {
//       user: req.user._id,
//     });

//     const categoryItemsQuantity = {};

//     allCategories.forEach((category) => {
//       categoryItemsQuantity[category] = 0;
//     });

//     const result = await Order.aggregate([
//       {
//         $match: {
//           user: req.user._id,
//         },
//       },
//       {
//         $unwind: "$orderItems",
//       },
//       {
//         $group: {
//           _id: "$orderItems.category",
//           totalQuantity: { $sum: "$orderItems.quantity" },
//         },
//       },
//     ]);

//     result.forEach((item) => {
//       categoryItemsQuantity[item._id] = item.totalQuantity;
//     });

//     res.json({ categoryItemsQuantity });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// get dataorder by
export const getDataOrderByStatus = catchAsyncErrors(async (req, res, next) => {
  const orderStatusList = [
    "NewOrder",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ];

  const orderCounts = {};

  for (const status of orderStatusList) {
    orderCounts[status] = 0;
  }

  const orders = await Order.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  orders.forEach((order) => {
    orderCounts[order._id] = order.count;
  });

  res.status(200).json({
    orderCounts,
  });
});
//
