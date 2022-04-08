import { createFavorite } from "./main.js";

export const favoriteList = [];

export function showStorage() {
  const favoriteCities = JSON.parse(localStorage.getItem('favorites'));

  favoriteCities.forEach(item => {
    createFavorite(item)
  });
}