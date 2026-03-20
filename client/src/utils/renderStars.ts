export const renderStars = (rating: number): string => {
  const fullStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  return `${fullStars}${emptyStars}`;
};
