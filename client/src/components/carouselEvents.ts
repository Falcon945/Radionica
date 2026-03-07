import { renderCarousel } from "./homeSections.js";
import type { Product } from "../types/Product.js";

type CarouselParams = {
  featuredProductsState: Product[];
  currentSlideIndex: number;
  setCurrentSlideIndex: (value: number) => void;
  restartAutoSlide: () => void;
};

export const updateCarouselOnly = ({
  featuredProductsState,
  currentSlideIndex,
  setCurrentSlideIndex,
  restartAutoSlide
}: CarouselParams): void => {
  const carouselContainer = document.querySelector(".carousel-wrapper");

  if (!carouselContainer) {
    return;
  }

  carouselContainer.innerHTML = renderCarousel(
    featuredProductsState,
    currentSlideIndex
  );

  attachCarouselEvents({
    featuredProductsState,
    currentSlideIndex,
    setCurrentSlideIndex,
    restartAutoSlide
  });
};

export const attachCarouselEvents = ({
  featuredProductsState,
  currentSlideIndex,
  setCurrentSlideIndex,
  restartAutoSlide
}: CarouselParams): void => {
  const prevButton = document.getElementById("prev-slide");
  const nextButton = document.getElementById("next-slide");
  const dots = document.querySelectorAll<HTMLButtonElement>(".carousel-dot");

  prevButton?.addEventListener("click", () => {
    if (featuredProductsState.length === 0) {
      return;
    }

    const nextIndex =
      currentSlideIndex === 0
        ? featuredProductsState.length - 1
        : currentSlideIndex - 1;

    setCurrentSlideIndex(nextIndex);

    updateCarouselOnly({
      featuredProductsState,
      currentSlideIndex: nextIndex,
      setCurrentSlideIndex,
      restartAutoSlide
    });

    restartAutoSlide();
  });

  nextButton?.addEventListener("click", () => {
    if (featuredProductsState.length === 0) {
      return;
    }

    const nextIndex =
      currentSlideIndex === featuredProductsState.length - 1
        ? 0
        : currentSlideIndex + 1;

    setCurrentSlideIndex(nextIndex);

    updateCarouselOnly({
      featuredProductsState,
      currentSlideIndex: nextIndex,
      setCurrentSlideIndex,
      restartAutoSlide
    });

    restartAutoSlide();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      setCurrentSlideIndex(index);

      updateCarouselOnly({
        featuredProductsState,
        currentSlideIndex: index,
        setCurrentSlideIndex,
        restartAutoSlide
      });

      restartAutoSlide();
    });
  });
};