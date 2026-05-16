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
import { Loader2, School } from "lucide-react";
import { useLoginUserMutation, useRegisterUserMutation } from "@/api/authApi";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const [loginUser, { isLoading: isLoginIsLoading }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegisterIsLoading }] = useRegisterUserMutation();

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
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* LEFT PANEL — branding, hidden on small */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-white text-center space-y-6 max-w-sm">
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <School size={48} />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Start Learning Today
          </h2>
          <p className="text-purple-200 text-lg leading-relaxed">
            Join thousands of students and unlock expert-led courses from anywhere in the world.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[["50K+", "Students"], ["500+", "Courses"], ["150+", "Countries"], ["4.8★", "Rating"]].map(([val, label]) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-black">{val}</p>
                <p className="text-xs text-purple-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg text-white">
              <School size={22} />
            </div>
            <span className="font-bold text-xl">E-<span className="text-purple-600">Learning</span></span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="font-semibold">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <Card className="border-border shadow-xl rounded-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to continue learning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" name="email" value={loginInput.email} onChange={(e) => handleInputChange(e, "login")} placeholder="you@example.com" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" name="password" value={loginInput.password} onChange={(e) => handleInputChange(e, "login")} placeholder="••••••••" className="h-11" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button onClick={() => handleRegistration("login")} disabled={isLoginIsLoading} className="w-full h-11 font-bold rounded-xl text-base">
                    {isLoginIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Log In"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button onClick={() => setActiveTab("signup")} className="text-primary font-semibold hover:underline">Sign Up</button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              <Card className="border-border shadow-xl rounded-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>Fill in the details below to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" name="name" type="text" value={signupInput.name} onChange={(e) => handleInputChange(e, "signup")} placeholder="John Doe" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" name="email" value={signupInput.email} onChange={(e) => handleInputChange(e, "signup")} placeholder="you@example.com" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" name="password" value={signupInput.password} onChange={(e) => handleInputChange(e, "signup")} placeholder="••••••••" className="h-11" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button onClick={() => handleRegistration("signup")} disabled={isRegisterIsLoading} className="w-full h-11 font-bold rounded-xl text-base">
                    {isRegisterIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Create Account"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button onClick={() => setActiveTab("login")} className="text-primary font-semibold hover:underline">Log In</button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
