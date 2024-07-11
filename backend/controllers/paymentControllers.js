import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Shipper from "../models/shipper.js";
import Stripe from "stripe";
import user from "../models/user.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1OKgzdCTjVkSlxmIIcFuoEtX"],
        quantity: item?.quantity,
      };
    });

    // const shippingInfo = body?.shippingInfo;
    // const { shippingUnit, code } = body?.shippingInfo?.shipping;
    const { address, city, phoneNo, zipCode, country, latitude, longitude } =
      body?.shippingInfo;
    const { shippingUnit, code } = body?.shippingInfo?.shipping;
    const shippingInfo = {
      address,
      city,
      phoneNo,
      zipCode,
      country,
      latitude,
      longitude,
    };
    const { shippingAmount } = body;
    let shipping_rate;
    if (shippingAmount == 0) {
      shipping_rate = "shr_1OKh3YCTjVkSlxmIxITQ7HHF";
    } else if (shippingAmount == 10) {
      shipping_rate = "shr_1OKh37CTjVkSlxmI107dE6s2";
    } else if (shippingAmount == 11) {
      shipping_rate = "shr_1PMXHcCTjVkSlxmIemWhtQOV";
    } else {
      shipping_rate = "shr_1PMXHsCTjVkSlxmIX4jDGNFt";
    }

    // const shipping_rate =
    //   body?.itemsPrice >= 200
    //     ? "shr_1OKh37CTjVkSlxmI107dE6s2"
    //     : "shr_1OKh3YCTjVkSlxmIxITQ7HHF";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: {
        ...shippingInfo,
        shippingUnit,
        code,
        itemsPrice: body?.totalAmount,
      },
      shipping_options: [
        {
          shipping_rate,
        },
      ],
      line_items,
    });
    res.status(200).json({
      url: session.url,
    });
  }
);
export const stripeCheckoutSessionShipper = catchAsyncErrors(
  async (req, res, next) => {
    const { totalPriceCOD } = req?.body;
    const body = req?.body;
    const userID = req?.user?._id.toString();

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
          },
          unit_amount: totalPriceCOD * 100,
        },
        quantity: 1,
      };
    });

    // truyền total amount vào
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      // them total amount vào
      metadata: { price: totalPriceCOD, userID: userID },
      line_items,
    });
    res.status(200).json({
      url: session.url,
    });
  }
);
// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSessionMobile = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1OKgzdCTjVkSlxmIIcFuoEtX"],
        quantity: item?.quantity,
      };
    });

    // const shippingInfo = body?.shippingInfo;
    // const { shippingUnit, code } = body?.shippingInfo?.shipping;
    const { address, city, phoneNo, zipCode, country, latitude, longitude } =
      body?.shippingInfo;
    const { shippingUnit, code } = body?.shippingInfo?.shipping;

    const shippingInfo = {
      address,
      city,
      phoneNo,
      zipCode,
      country,
      latitude,
      longitude,
    };
    console.log(shippingInfo);
    const { shippingAmount } = body;
    let shipping_rate;
    if (shippingAmount == 0) {
      shipping_rate = "shr_1OKh3YCTjVkSlxmIxITQ7HHF";
    } else if (shippingAmount == 10) {
      shipping_rate = "shr_1OKh37CTjVkSlxmI107dE6s2";
    } else if (shippingAmount == 11) {
      shipping_rate = "shr_1PMXHcCTjVkSlxmIemWhtQOV";
    } else {
      shipping_rate = "shr_1PMXHsCTjVkSlxmIX4jDGNFt";
    }

    // const shipping_rate =
    //   body?.itemsPrice >= 200
    //     ? "shr_1OKh37CTjVkSlxmI107dE6s2"
    //     : "shr_1OKh3YCTjVkSlxmIxITQ7HHF";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/payment/mobile/success`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: {
        ...shippingInfo,
        shippingUnit,
        code,
        itemsPrice: body?.totalAmount,
      },
      shipping_options: [
        {
          shipping_rate,
        },
      ],
      line_items,
    });
    res.status(200).json({
      url: session.url,
    });
  }
);

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

// Create new order after payment   =>  /api/v1/payment/webhook
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("thanh cong thanh cong thanh cong");
      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const orderItems = await getOrderItems(line_items);
      console.log(orderItems);

      if (orderItems[0].name === "Total COD Amount") {
        const id = session.metadata.userID;

        const shipper = await Shipper.findOne({ user: id });
        shipper.totalPriceCOD = 0;
        await shipper.save();
      } else {
        const user = session.client_reference_id;

        const totalAmount = session.amount_total / 100;
        const taxAmount = session.total_details.amount_tax / 100;
        const shippingAmount = session.total_details.amount_shipping / 100;
        const itemsPrice = session.metadata.itemsPrice;

        const shippingInfo = {
          address: session.metadata.address,
          city: session.metadata.city,
          phoneNo: session.metadata.phoneNo,
          zipCode: session.metadata.zipCode,
          country: session.metadata.country,
          shipping: {
            shippingUnit: session.metadata.shippingUnit,
            code: session.metadata.code,
          },
          latitude: session.metadata.latitude,
          longitude: session.metadata.longitude,
        };

        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status,
        };
        const orderData = {
          shippingInfo,
          orderItems,
          itemsPrice,
          taxAmount,
          shippingAmount,
          totalAmount,
          paymentInfo,
          paymentMethod: "Card",
          user,
        };

        await Order.create(orderData);
      }
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error => ", error);
  }
});
