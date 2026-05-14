import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ArrowRight } from "lucide-react";

const levelColors = {
  Beginner: "bg-emerald-500/90",
  Intermediate: "bg-amber-500/90",
  Advanced: "bg-rose-500/90",
};

const Course = ({ course }) => {
  return (
    <Link to={`/course-details/${course._id}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative overflow-hidden h-48">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Level badge — overlaid on image */}
          <span
            className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
              levelColors[course.courseLevel] || "bg-indigo-500/90"
            }`}
          >
            {course.courseLevel}
          </span>

          {/* Hover CTA slide-up */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-indigo-700 to-indigo-600 py-2 px-4 flex items-center justify-center gap-2 text-white text-sm font-semibold">
            Enroll Now <ArrowRight size={14} />
          </div>
        </div>

        <CardContent className="p-5 flex flex-col gap-3">
          {/* Title */}
          <h2 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.courseTitle}
          </h2>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={course.creator?.photoUrl} />
              <AvatarFallback className="text-xs">
                {course.creator?.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {course.creator?.name}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-extrabold text-primary">
              ₹{course.coursePrice}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Lifetime Access
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
