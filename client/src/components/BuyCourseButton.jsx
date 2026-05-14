import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate(`/checkout/${courseId}`);
  };

  return (
    <Button
      onClick={handleBuy}
      className="bg-purple-500 w-full text-white hover:bg-purple-600"
    >
      Buy Course Now
    </Button>
  );
};

export default BuyCourseButton;
