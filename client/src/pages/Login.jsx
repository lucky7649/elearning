import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLoginUserMutation, useRegisterUserMutation } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Destructuring data, error, and loading states directly from the tuple
  const [
    loginUser,
    {
      isLoading: isLoginIsLoading, 
    },
  ] = useLoginUserMutation();
  const [
    registerUser,
    {
      isLoading: isRegisterIsLoading, 
    },
  ] = useRegisterUserMutation();

  // Handle input changes
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    try {
      const data = await action(inputData).unwrap();
      if (type === "signup") {
        toast.success(data.message || "Signup successful");
        setActiveTab("login");
      } else {
        toast.success(data.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || (type === "signup" ? "Signup failed" : "Login failed"));
    }
  };

  return (
    <div className="flex justify-center my-16 px-4 sm:px-8 md:px-16">
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-[400px]">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="signup">Signup</TabsTrigger>
      <TabsTrigger value="login">Login</TabsTrigger>
    </TabsList>
    <TabsContent value="signup">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Create a new account and click signup when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={signupInput.name}
              onChange={(e) => handleInputChange(e, "signup")}
              id="name"
              type="text"
              placeholder="Patel"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={signupInput.email}
              onChange={(e) => handleInputChange(e, "signup")}
              placeholder="abc@gmail.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={signupInput.password}
              onChange={(e) => handleInputChange(e, "signup")}
              placeholder="Password"
            />
          </div>
        </CardContent>
        <CardFooter>
          {isRegisterIsLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button onClick={() => handleRegistration("signup")}>
              Signup
            </Button>
          )}
        </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login your password here. After signup, you'll be logged in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={loginInput.email}
              onChange={(e) => handleInputChange(e, "login")}
              placeholder="abc@gmail.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={loginInput.password}
              onChange={(e) => handleInputChange(e, "login")}
              placeholder="Password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => handleRegistration("login")}
            disabled={isLoginIsLoading}
          >
            {isLoginIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</div>

  );
};

export default Login;
