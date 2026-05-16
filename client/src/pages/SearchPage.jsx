import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle, SearchX } from "lucide-react";
import { Button } from "../components/ui/button";
import { useGetSearchedCoursesQuery } from "@/api/courseApi";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // State to track selected filters from the Filter component
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  // Fetch courses based on query and selected filters
  const { data, isLoading } = useGetSearchedCoursesQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  // Determine if there are no courses found
  const isEmpty = !isLoading && data?.courses?.length === 0;

  // Handler to receive category and level selection changes from Filter component
  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 p-5 md:p-8 rounded-2xl bg-primary/5 border border-primary/10">
        <h1 className="font-extrabold text-2xl md:text-4xl text-foreground mb-1">
          Search Results
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Found <span className="font-bold text-foreground">{data?.courses?.length || 0}</span> courses for{" "}
          <span className="text-primary font-bold">"{query}"</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <Filter onFilterChange={handleFilterChange} />
        
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : isEmpty ? (
            <CourseNotFound query={query} />
          ) : (
            data?.courses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-card border border-border rounded-2xl shadow-sm p-12 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <SearchX className="text-muted-foreground h-10 w-10" />
      </div>
      <h1 className="font-extrabold text-2xl md:text-3xl text-foreground mb-3">
        No courses found
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
        We couldn't find any courses matching <span className="font-semibold text-foreground">"{query}"</span>. Try adjusting your filters or searching for something else.
      </p>
      <Link to="/course/search?query">
        <Button size="lg" className="font-bold rounded-full px-8">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseCardSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border rounded-2xl p-4 gap-6 shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
        <Skeleton className="h-40 w-full md:w-64 rounded-xl flex-shrink-0" />
        
        <div className="flex flex-col gap-3 py-2 w-full md:w-[400px]">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          
          <div className="mt-auto pt-4 flex items-center gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto flex flex-col items-end justify-center">
        <Skeleton className="h-4 w-12 mb-2 hidden md:block" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};
