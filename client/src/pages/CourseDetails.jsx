import { BadgeInfo, Lock, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ReactPlayer from "react-player/lazy";
import { Separator } from "../components/ui/separator";
import BuyCourseButton from "@/components/BuyCourseButton";
import { useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";
import { Button } from "@/components/ui/button";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailsWithStatusQuery(courseId);

  const [localPurchased, setLocalPurchased] = useState(false);

  useEffect(() => {
    if (data?.purchased) {
      setLocalPurchased(true);
    }
  }, [data]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground font-semibold">Loading course details...</p>
    </div>
  );
  
  if (isError) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-destructive font-semibold">Failed to load course details. Please try again later.</p>
    </div>
  );

  const course = data?.course;
  const firstLecture = course?.lectures?.[0];
  const canWatchVideo = localPurchased || firstLecture?.isPreviewFree;

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground mb-20">
      {/* PREMIUM HEADER */}
      <div className="bg-[#0f0c29] text-white w-full border-b border-white/10">
        <div className="max-w-7xl mx-auto py-10 md:py-16 px-4 md:px-8 flex flex-col gap-6">
          <div className="space-y-3 max-w-3xl">
            <h1 className="font-extrabold text-2xl md:text-4xl lg:text-5xl leading-tight">
              {course?.courseTitle}
            </h1>
            <p className="text-gray-300 text-base md:text-lg font-medium">
              {course?.subTitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-4">
              <p className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-xs md:text-sm">
                Created By <span className="font-bold text-white">{course?.creator?.name}</span>
              </p>
              <div className="flex items-center gap-2">
                <BadgeInfo size={16} className="text-purple-400" />
                <span className="text-xs md:text-sm">Last updated {course?.createdAt?.split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative pb-16">
        
        {/* LEFT COLUMN: COURSE DETAILS */}
        <div className="w-full lg:w-2/3 space-y-10">
          
          {/* DESCRIPTION */}
          <section>
            <h2 className="font-extrabold text-2xl md:text-3xl mb-6">About this course</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p
                dangerouslySetInnerHTML={{
                  __html: course?.description,
                }}
              />
            </div>
          </section>

          {/* COURSE CONTENT */}
          <section>
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border pb-6">
                <CardTitle className="text-2xl font-bold">Course Content</CardTitle>
                <CardDescription className="text-base font-medium">
                  {course?.lectures?.length || 0} lectures
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-border">
                  {course?.lectures?.map((lecture, index) => (
                    <div 
                      key={lecture._id} 
                      className={`flex items-center justify-between p-5 hover:bg-muted/50 transition-colors ${lecture.isPreviewFree ? 'cursor-pointer' : 'opacity-80'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lecture.isPreviewFree ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {lecture.isPreviewFree ? (
                            <PlayCircle size={16} />
                          ) : (
                            <Lock size={16} />
                          )}
                        </div>
                        <span className={`font-medium ${lecture.isPreviewFree ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {index + 1}. {lecture.lectureTitle}
                        </span>
                      </div>
                      {lecture.isPreviewFree && (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Preview</span>
                      )}
                    </div>
                  ))}
                  {(!course?.lectures || course.lectures.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground font-medium">
                      No lectures available yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* RIGHT COLUMN: PURCHASE WIDGET */}
        <div className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-10">
            <Card className="overflow-hidden border-border rounded-3xl shadow-xl shadow-primary/5">
              <CardContent className="p-0">
                
                {/* VIDEO OR THUMBNAIL */}
                <div className="relative w-full aspect-video bg-black group">
                  {canWatchVideo && firstLecture ? (
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={
                        firstLecture.videoInfo?.videoUrl ||
                        firstLecture.videoUrl
                      }
                      controls
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={course?.courseThumbnail}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      {/* LOCKED OVERLAY */}
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm transition-opacity group-hover:bg-black/70">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                          <Lock className="h-8 w-8 text-white/90" />
                        </div>
                        <p className="font-bold text-lg">Preview Locked</p>
                        <p className="text-sm text-white/70 font-medium mt-1">Purchase to unlock course</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-8">
                  <h2 className="font-extrabold text-3xl md:text-4xl text-foreground mb-4 md:mb-6">
                    {course?.coursePrice === 0 ? "Free" : `₹${course?.coursePrice}`}
                  </h2>

                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <ShieldCheck size={18} className="text-green-500" />
                      Full lifetime access
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <Zap size={18} className="text-yellow-500" />
                      Learn at your own pace
                    </div>
                  </div>

                  {localPurchased ? (
                    <Button
                      onClick={handleContinueCourse}
                      size="lg"
                      className="w-full font-bold text-lg h-14 rounded-xl"
                    >
                      Continue Course
                    </Button>
                  ) : (
                    <BuyCourseButton
                      courseId={courseId}
                      course={course}
                      onSuccess={() => setLocalPurchased(true)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
