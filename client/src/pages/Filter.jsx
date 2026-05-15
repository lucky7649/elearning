import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      onFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    onFilterChange(selectedCategories, selectedValue);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortByPrice("");
    onFilterChange([], "");
  };

  return (
    <div className="w-full md:w-[25%] p-6 bg-card border border-border rounded-2xl shadow-sm h-fit">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-extrabold text-lg md:text-xl">Filters</h1>
        {(selectedCategories.length > 0 || sortByPrice) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:bg-primary/10 h-8 px-2 text-xs font-semibold">
            Clear All
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <Select value={sortByPrice} onValueChange={selectByPriceHandler}>
          <SelectTrigger className="w-full h-10 font-medium">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By Price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />
      
      <div>
        <h1 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Categories</h1>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="transition-all"
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
