import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailsWithStatusQuery, useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from "@/api/purchaseApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingCourse } = useGetCourseDetailsWithStatusQuery(courseId);
  const [createRazorpayOrder, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all contact details");
      return;
    }

    // 1. Load Razorpay checkout script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    try {
      // 2. Create Order in Backend
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
        description: `Purchase Course: ${data.course.courseTitle}`,
        image: data.course.courseThumbnail || "https://res.cloudinary.com/dj75vhwsj/image/upload/v1778775671/j65po1aurjirhkssmsyf.pdf", // Use logo or course thumbnail
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
              navigate(`/course-progress/${courseId}`);
            } else {
              toast.error(verificationResult.message || "Payment verification failed.");
            }
          } catch (verifyError) {
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          courseId: courseId,
        },
        theme: {
          color: "#a855f7", // Premium purple brand color
        },
      };

      const razorpayModal = new window.Razorpay(options);
      razorpayModal.open();

    } catch (err) {
      toast.error(err?.data?.message || "Order creation failed.");
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!data?.course) {
    return <div className="text-center mt-10 text-red-500">Course not found.</div>;
  }

  const course = data.course;
  const isProcessing = isCreatingOrder || isVerifyingPayment;

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md border-border shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary" size={24} /> Secure Checkout
          </CardTitle>
          <CardDescription className="text-sm font-medium mt-1">
            Unlock complete access to <b>{course.courseTitle}</b>.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          
          {/* COURSE CARD PREVIEW */}
          <div className="flex items-center gap-4 bg-muted/20 border border-border p-3.5 rounded-2xl">
            <img 
              src={course.courseThumbnail} 
              alt={course.courseTitle} 
              className="w-16 h-16 rounded-xl object-cover border border-border"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm truncate">{course.courseTitle}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">By {course.creator?.name || "Instructor"}</p>
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border border-primary/10">Premium Course</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Your Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-xl h-11"
                required
              />
            </div>
          </form>

          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center justify-between mt-6">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-semibold">Amount to Pay</p>
              <p className="text-2xl font-black text-foreground">₹{course.coursePrice}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-full font-semibold">
              <ShieldCheck className="text-green-500" size={14} /> Secured by Razorpay
            </div>
          </div>

        </CardContent>
        <CardFooter className="pb-6">
          <Button
            className="w-full font-bold text-base h-13 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/10"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initiating Secure Payment...
              </>
            ) : (
              `Pay Now ₹${course.coursePrice}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Checkout;
