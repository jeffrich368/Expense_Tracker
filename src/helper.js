import { CATEGORIES } from "./constant";

export const getCategoryById = (id) => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

export const getCategoryDate = (date) => {
  return new Date().toString().split("||")[0].split(" ").slice(1, 4).join(" ");
};

export const getCategoryColor = (color) => {
  const category = CATEGORIES.find((cat) => cat.color === color);
  return category ? category.color : 'bg-gray-100'; // Default color if not found
}