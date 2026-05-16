import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoadUserQuery } from "@/api/authApi";
import { BookOpen, Search, ArrowRight, PlayCircle, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const myLearning = data?.user?.enrolledCourses || [];

  const filtered = myLearning.filter((course) =>
    course.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">

      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-background dark:bg-[#0A0A0A] border-b border-border py-12 px-4 md:px-8">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-30%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-[-30%] right-[5%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Your Learning Dashboard
          </div>

          {/* Heading row + search bar inline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Learning</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Continue where you left off. You have{" "}
                <span className="font-bold text-foreground">{myLearning.length}</span> course{myLearning.length !== 1 ? "s" : ""} enrolled.
              </p>
            </div>

            {/* Search bar — right side of heading row */}
            {!isLoading && myLearning.length > 0 && (
              <div className="relative w-full sm:w-72 shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your courses..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
              <div className="relative w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center shadow-xl">
                <BookOpen size={36} className="text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Start Your Learning Journey</h2>
            <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
              You haven't enrolled in any courses yet. Explore hundreds of expert-led courses and start learning today.
            </p>
            <Button
              className="rounded-full px-8 h-12 font-bold text-base shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              onClick={() => navigate("/course/search?query")}
            >
              Browse Courses <ArrowRight size={18} />
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          /* NO SEARCH RESULTS */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed border-border rounded-3xl">
            <Search size={32} className="text-muted-foreground mb-4" />
            <h3 className="font-bold text-lg mb-2">No courses match "{searchQuery}"</h3>
            <p className="text-muted-foreground text-sm mb-4">Try a different search term.</p>
            <button onClick={() => setSearchQuery("")} className="text-primary font-semibold text-sm hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          /* COURSE GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((course) => (
              <LearningCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------- CUSTOM LEARNING CARD -------- */
const LearningCourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate(`/course-progress/${course._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
            <PlayCircle size={28} className="text-white" />
          </div>
        </div>

        {/* Level badge */}
        {course.courseLevel && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10">
            {course.courseLevel}
          </span>
        )}

        {/* Continue tag */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow">
            <PlayCircle size={12} /> Continue Learning
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.courseTitle}
        </h3>

        {course.creator?.name && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold shrink-0">
              {course.creator.name[0]?.toUpperCase()}
            </span>
            {course.creator.name}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Enrolled
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowRight size={12} /> Open Course
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------- SKELETON -------- */
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
        <div className="h-44 bg-muted" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3 mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default MyLearning;
