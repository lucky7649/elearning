import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import Course from "./Course";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import {
  Loader2, Pencil, Mail, ShieldCheck, BookOpen, Camera, User
} from "lucide-react";
import { useLoadUserQuery, useUpdateProfileMutation } from "@/api/authApi";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data: userProfile, isLoading: profileLoading, refetch } = useLoadUserQuery();
  const [updateProfile, { data, isLoading, isError, isSuccess, error }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userProfile) setName(userProfile.user.name);
  }, [userProfile]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const profileUpdateHandle = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateProfile(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [isSuccess, isError]);

  if (profileLoading) return <ProfileSkeleton />;

  if (!userProfile || !userProfile.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <User size={28} className="text-muted-foreground" />
        </div>
        <h1 className="font-bold text-xl mb-2">Please log in to view your profile</h1>
        <Button onClick={() => (window.location.href = "/login")} className="mt-4 rounded-full px-8">
          Go to Login
        </Button>
      </div>
    );
  }

  const { user } = userProfile;
  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 h-40 md:h-52 w-full overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* PROFILE CARD */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">

          {/* TOP ROW: Avatar + Name + Edit Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 px-6 md:px-10 pt-6 pb-6 border-b border-border">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-card shadow-xl">
                <AvatarImage src={user.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-extrabold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Camera Overlay */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </DialogTrigger>
                <EditProfileDialog
                  name={name}
                  setName={setName}
                  previewUrl={previewUrl}
                  user={user}
                  onChangeHandler={onChangeHandler}
                  isLoading={isLoading}
                  profileUpdateHandle={profileUpdateHandle}
                />
              </Dialog>
            </div>

            {/* Name + Role + Edit button */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold">{user.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${user.role === "instructor"
                  ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                  : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                }`}>
                {user.role}
              </span>
            </div>

            {/* Edit Button (full dialog) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full px-5 font-bold flex items-center gap-2 shrink-0" variant="outline">
                  <Pencil size={14} /> Edit Profile
                </Button>
              </DialogTrigger>
              <EditProfileDialog
                name={name}
                setName={setName}
                previewUrl={previewUrl}
                user={user}
                onChangeHandler={onChangeHandler}
                isLoading={isLoading}
                profileUpdateHandle={profileUpdateHandle}
              />
            </Dialog>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-4 px-6 md:px-10 py-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-blue-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Email</p>
                <p className="font-semibold text-sm truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 md:px-10 py-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Role</p>
                <p className="font-semibold text-sm capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 md:px-10 py-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Enrolled</p>
                <p className="font-semibold text-sm">{user.enrolledCourses?.length || 0} Courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* ENROLLED COURSES SECTION */}
        <div className="mt-10 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Enrolled Courses</h2>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {user.enrolledCourses?.length || 0} total
            </span>
          </div>

          {user.enrolledCourses?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed border-border rounded-3xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">No courses yet</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                You haven't enrolled in any courses. Start learning today!
              </p>
              <Button className="rounded-full px-8 font-bold" onClick={() => (window.location.href = "/course/search?query")}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {user.enrolledCourses.map((course) => (
                <Course key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* -------- EDIT PROFILE DIALOG (reusable) -------- */
const EditProfileDialog = ({ name, setName, previewUrl, user, onChangeHandler, isLoading, profileUpdateHandle }) => (
  <DialogContent className="sm:max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Update your name and profile photo, then click save.
      </DialogDescription>
    </DialogHeader>

    {/* Photo Preview */}
    <div className="flex justify-center py-2">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-border shadow-lg">
          <AvatarImage src={previewUrl || user.photoUrl} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xl font-bold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>

    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="edit-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-photo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Photo</Label>
        <Input
          type="file"
          id="edit-photo"
          accept="image/*"
          onChange={onChangeHandler}
          className="h-11 rounded-xl cursor-pointer"
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        onClick={profileUpdateHandle}
        disabled={isLoading}
        className="w-full h-11 font-bold rounded-xl"
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          "Save Changes"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
);

/* -------- SKELETON -------- */
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 h-40 md:h-52 w-full" />
    <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
      <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 px-6 md:px-10 pt-6 pb-6 border-b border-border">
          <div className="h-28 w-28 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-36 bg-muted rounded-lg" />
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>
          <div className="h-10 w-28 bg-muted rounded-full shrink-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 md:px-10 py-5">
              <div className="w-10 h-10 rounded-xl bg-muted" />
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 space-y-4">
        <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
