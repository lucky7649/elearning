import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Menu, Sun, Moon, School, Home, BookOpen, User, LayoutDashboard } from "lucide-react";
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

      {/* DESKTOP NAV */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-6 h-full">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform">
            <School size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            E-<span className="text-purple-600">Learning</span>
          </h1>
        </Link>

        {/* RIGHT SIDE: Nav Links + Auth */}
        <div className="flex items-center gap-4">
          <NavLinks />
          <div className="hidden lg:block border-l border-border h-6 mx-1" />
          
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
              <Button variant="ghost" className="rounded-full px-6 font-semibold" onClick={() => navigate("/login")}>
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

          <div className="border-l border-border h-6 mx-2" />
          <DarkMode />
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg text-white">
            <School size={18} />
          </div>
          <h1 className="font-bold text-lg">E-<span className="text-purple-600">Learning</span></h1>
        </Link>

        <div className="flex items-center gap-2">
          <DarkMode />
          <MobileNavbar user={user} logoutHandler={logoutHandler} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

/* NAV LINKS (desktop) */
const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Our Courses", to: "/course/search?query" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const NavLinks = () => {
  const location = useLocation();
  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.to.split("?")[0];
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

/* MOBILE NAV SHEET */
const MobileNavbar = ({ user, logoutHandler }) => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-muted text-foreground hover:bg-muted/80 border border-border" variant="outline">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-[80vw] max-w-sm">
        {/* HEADER */}
        <SheetHeader className="flex flex-row items-center justify-between mt-2 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 rounded-lg text-white">
              <School size={16} />
            </div>
            E-Learning
          </SheetTitle>
        </SheetHeader>

        {/* USER INFO */}
        {user && (
          <div className="flex items-center gap-3 py-4 border-b border-border">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        )}

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1 py-4 flex-1 overflow-y-auto">
          {/* Public links */}
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Browse</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to.split("?")[0];
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                  ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-border" />

          {/* Account links */}
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account</p>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Home size={16} className="text-muted-foreground" /> Home
          </Link>

          {user?.role === "student" && (
            <Link to="/learning" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <BookOpen size={16} className="text-muted-foreground" /> My Learning
            </Link>
          )}

          {user && (
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <User size={16} className="text-muted-foreground" /> Edit Profile
            </Link>
          )}

          {user?.role === "instructor" && (
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <LayoutDashboard size={16} className="text-muted-foreground" /> Instructor Dashboard
            </Link>
          )}
        </nav>

        {/* FOOTER */}
        <SheetFooter className="pt-4 border-t border-border flex flex-col gap-3">
          {user ? (
            <Button
              onClick={logoutHandler}
              variant="destructive"
              className="w-full font-bold rounded-xl"
            >
              <LogOut size={16} className="mr-2" /> Log Out
            </Button>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Button onClick={() => navigate("/login")} className="w-full font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                Log In
              </Button>
              <Button onClick={() => navigate("/login")} variant="outline" className="w-full font-bold rounded-xl">
                Sign Up
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
