import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCoursesQuery } from "@/api/courseApi";
import { SlidersHorizontal } from "lucide-react";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const { data, isLoading, isError } = useGetAllCoursesQuery();
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState("All");

  const allCourses = data?.courses || [];
  const filtered =
    activeLevel === "All"
      ? allCourses
      : allCourses.filter((c) => c.courseLevel === activeLevel);

  if (isError)
    return (
      <p className="text-center text-red-500 py-20">
        Something went wrong while loading courses.
      </p>
    );

  return (
    <section className="bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="block w-10 h-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
              <span className="text-sm font-semibold text-purple-500 uppercase tracking-wider">
                Our Catalogue
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Explore Top Courses
            </h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Hand-picked courses from expert instructors to accelerate your career.
            </p>
          </div>

          <button
            onClick={() => navigate("/course/search?query")}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 whitespace-nowrap self-start md:self-auto"
          >
            View all courses →
          </button>
        </div>

        {/* Level filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                ${
                  activeLevel === level
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md"
                    : "bg-muted text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CourseSkeleton key={i} />)
            : filtered.length > 0
            ? filtered.map((course) => (
                <Course key={course._id} course={course} />
              ))
            : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No courses found for "{activeLevel}"</p>
                <button
                  onClick={() => setActiveLevel("All")}
                  className="mt-3 text-primary text-sm hover:underline"
                >
                  Show all courses
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Courses;

const CourseSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
    <Skeleton className="w-full h-48" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  </div>
);
