import React from "react";

const PayButton = () => {
  const makePayment = () => {
    // Generate a unique transaction reference
    const txRef = "TX-" + Math.floor(Math.random() * 1000000000 + 1);

    // Call PayChangu Checkout
    window.PaychanguCheckout({
      public_key: "pub-test-HYSBQpa5K91mmXMHrjhkmC6mAjObPJ2u", // Your public key
      tx_ref: txRef,
      amount: 1000, // Amount in MWK
      currency: "MWK",
      callback_url: "https://your-backend.com/callback", // Will be called by PayChangu
      return_url: "https://your-frontend.com/payment-status", // Redirect after payment
      customer: {
        email: "customer@example.com",
        first_name: "John",
        last_name: "Doe",
      },
      customization: {
        title: "Malonda Purchase",
        description: "Buying product",
      },
      meta: {
        orderId: "12345",
      },
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <button
        style={{
          background: "#004674",
          color: "#fff",
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={makePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PayButton;
