import React, { useEffect } from "react";
import { LogOut, Menu, Sun, Moon, School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DarkMode from "./DarkMode";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLogoutUserMutation } from "@/api/authApi";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50">
      
      {/* ---------------- DESKTOP ---------------- */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-6 h-full">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform">
            <School size={20} />
          </div>
          <h1 className="hidden md:block font-bold text-xl tracking-tight">
            E-<span className="text-purple-600">Learning</span>
          </h1>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border border-border hover:border-primary transition-colors">
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user?.role === "student" && (
                  <DropdownMenuItem onClick={() => navigate("/learning")} className="cursor-pointer">
                    My Learning
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  Edit Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer text-red-500 focus:text-red-500">
                  Log out
                  <DropdownMenuShortcut>
                    <LogOut size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {user?.role === "instructor" && (
                  <DropdownMenuItem className="p-2">
                    <Button
                      onClick={() => navigate("/admin/dashboard")}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      Instructor Dashboard
                    </Button>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="rounded-full px-6 font-semibold"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>

              <Button
                className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/20"
                onClick={() => navigate("/login")}
              >
                Sign up
              </Button>
            </div>
          )}

          <div className="border-l border-border h-6 mx-2 hidden sm:block" />
          <DarkMode />
        </div>
      </div>

      {/* ---------------- MOBILE ---------------- */}
      <div className="flex md:hidden items-center justify-between px-6 h-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg text-white">
            <School size={18} />
          </div>
          <h1 className="font-bold text-lg">E-Learning</h1>
        </Link>

        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

/* ---------------- MOBILE NAV ---------------- */
const MobileNavbar = ({ user, logoutHandler }) => {
  const { setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
          variant="outline"
        >
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        
        {/* HEADER */}
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>E-Learning</SheetTitle>

          {/* THEME */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>

        <Separator className="my-2" />

        {/* NAV LINKS */}
        <nav className="flex flex-col space-y-4">

          {/* ✅ ONLY STUDENT */}
          {user?.role === "student" && (
            <Link to="/learning">My Learning</Link>
          )}

          <Link to="/profile">Edit Profile</Link>

          <p onClick={logoutHandler} className="cursor-pointer">
            Log Out
          </p>
        </nav>

        {/* FOOTER */}
        <SheetFooter>
          {user?.role === "instructor" && (
            <Link to="/admin/dashboard">
              <Button className="w-full mt-2 bg-purple-300 text-purple-700 hover:bg-purple-300">
                Dashboard
              </Button>
            </Link>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
