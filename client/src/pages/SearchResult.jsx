import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <Link 
      to={`/course-details/${course._id}`} 
      className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border rounded-2xl p-4 gap-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 mb-4"
    >
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto overflow-hidden">
        <div className="relative overflow-hidden rounded-xl h-40 w-full md:w-64 flex-shrink-0">
          <img
            src={course.courseThumbnail}
            alt="course_img"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-fit">
              {course.courseLevel}
            </Badge>
          </div>
          
          <h1 className="font-extrabold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.courseTitle}
          </h1>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {course.subTitle}
          </p>
          
          <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>By</span>
            <span className="font-semibold text-foreground">{course.creator?.name || "Instructor"}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-border pt-4 md:pt-0">
        <div className="text-sm font-semibold text-muted-foreground mb-1 hidden md:block">Price</div>
        <h1 className="font-extrabold text-2xl text-foreground">
          {course.coursePrice === 0 ? "Free" : `₹${course.coursePrice}`}
        </h1>
      </div>
    </Link>
  );
};

export default SearchResult;
