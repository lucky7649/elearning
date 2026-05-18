import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from "@/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyCourseButton = ({ courseId, course, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [createRazorpayOrder, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();

  const handleBuy = async () => {
    // 1. Load Razorpay checkout script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    try {
      // 2. Create Razorpay order in backend
      const orderResponse = await createRazorpayOrder({ courseId }).unwrap();
      if (!orderResponse?.success) {
        toast.error("Failed to initiate payment");
        return;
      }

      const { order, keyId } = orderResponse;

      // 3. Configure Razorpay modal options
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "E-Learning Platform",
        description: `Purchase Course: ${course?.courseTitle || ""}`,
        image: course?.courseThumbnail || "",
        order_id: order.id,
        handler: async (response) => {
          // 4. Verify Payment in Backend
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
          };

          try {
            const verificationResult = await verifyRazorpayPayment(verifyPayload).unwrap();
            if (verificationResult.success) {
              toast.success("Payment verified! Course unlocked successfully.");
              if (onSuccess) onSuccess();
              navigate(`/course-progress/${courseId}`);
            } else {
              toast.error(verificationResult.message || "Payment verification failed.");
            }
          } catch (verifyError) {
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: "", // Razorpay will ask the user directly for phone if needed
        },
        notes: {
          courseId: courseId,
        },
        theme: {
          color: "#a855f7", // Premium brand purple
        },
      };

      const razorpayModal = new window.Razorpay(options);
      razorpayModal.open();

    } catch (err) {
      toast.error(err?.data?.message || "Order creation failed.");
    }
  };

  const isProcessing = isCreatingOrder || isVerifyingPayment;

  return (
    <Button
      onClick={handleBuy}
      disabled={isProcessing}
      className="bg-purple-600 w-full text-white hover:bg-purple-700 font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-2"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Initiating Payment...
        </>
      ) : (
        "Buy Course Now"
      )}
    </Button>
  );
};

export default BuyCourseButton;
