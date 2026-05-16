import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Users, BookOpen, ChevronRight, Award } from "lucide-react";

const SearchResult = ({ course }) => {
  return (
    <Link 
      to={`/course-details/${course._id}`} 
      className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border rounded-2xl p-4 gap-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 mb-4 overflow-hidden relative"
    >
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto overflow-hidden relative z-10">
        {/* Thumbnail with overlay */}
        <div className="relative overflow-hidden rounded-xl h-44 md:h-40 w-full md:w-64 flex-shrink-0">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          {/* Level badge pinned to image */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow-sm text-[10px] uppercase font-bold py-0.5 px-2">
              {course.courseLevel}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 py-1">
          {/* Category/Tag line */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            <BookOpen size={12} />
            <span>Premium Course</span>
          </div>
          
          <h1 className="font-extrabold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {course.courseTitle}
          </h1>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-xl">
            {course.subTitle}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                {course.creator?.name?.[0] || "I"}
              </div>
              <span className="font-medium text-foreground">{course.creator?.name || "Instructor"}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
              <Clock size={12} className="text-primary" />
              <span>Lifetime Access</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
              <Award size={12} className="text-amber-500" />
              <span>Certified</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Price and CTA */}
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-border pt-4 md:pt-0 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden md:block mb-1">Full Access</span>
          <h1 className="font-black text-2xl text-foreground flex items-baseline gap-1">
            {course.coursePrice === 0 ? "Free" : `₹${course.coursePrice}`}
            {course.coursePrice !== 0 && <span className="text-xs font-medium text-muted-foreground line-through">₹{Math.round(course.coursePrice * 1.5)}</span>}
          </h1>
        </div>
        
        <div className="md:mt-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResult;
