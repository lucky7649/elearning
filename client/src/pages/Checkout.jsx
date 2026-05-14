import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePurchaseCourseMutation, useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingCourse } = useGetCourseDetailsWithStatusQuery(courseId);
  const [purchaseCourse, { isLoading }] = usePurchaseCourseMutation();

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvc) {
      toast.error("Please fill in all payment details");
      return;
    }

    try {
      // Calling the backend to mock the payment and save purchase
      await purchaseCourse({ courseId }).unwrap();
      toast.success("Payment successful! Redirecting to course...");
      navigate(`/course-progress/${courseId}`);
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed");
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

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mock Checkout</CardTitle>
          <CardDescription>
            Complete your purchase for <b>{course.courseTitle}</b>. This is a simulated payment gateway.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name on Card</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9101 1121"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={formData.cvc}
                  onChange={handleChange}
                  maxLength={3}
                  type="password"
                  required
                />
              </div>
            </div>
          </form>
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{course.coursePrice}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${course.coursePrice}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Checkout;
