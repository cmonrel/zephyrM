/**
 * Categories slice
 *

 *
 * @module store/assetsModule/categoriesSlice
 */

import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../interfaces";

interface CategoriesState {
  isLoadingCategories: boolean;
  categories: Category[];
  activeCategory: Category | null;
}

const initialState: CategoriesState = {
  isLoadingCategories: true,
  categories: [],
  activeCategory: null,
};

/**
 * This slice contains the state and reducers for the categories module.
 */
export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    /**
     * Sets the categories list and sets isLoadingCategories to false.
     *
     * This reducer is used when the categories list is loaded from the server.
     * It receives the list of categories as a payload and sets the state
     * with that list. It also sets isLoadingCategories to false to
     * indicate that the categories have been loaded.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of categories.
     */
    onLoadCategories: (state, { payload }) => {
      state.isLoadingCategories = false;
      state.categories = payload;
    },
    /**
     * Sets the active category to the given category.
     *
     * This reducer is used when a user clicks on the delete button for a category in the list.
     * It receives the category object as a payload and sets the state
     * with that category.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the category object.
     */
    onSetActiveCategory: (state, { payload }) => {
      state.activeCategory = payload;
    },
    /**
     * Adds a new category to the list of categories and sets the active category to null.
     *
     * This reducer is used when a new category is created. It receives the new
     * category object as a payload and adds it to the list of categories in the state.
     * It also sets the active category to null.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new category object.
     */
    onAddNewCategory: (state, { payload }) => {
      state.categories.push(payload);
      state.activeCategory = null;
    },
    /**
     * Deletes the active category from the list of categories and sets the active category to null.
     *
     * This reducer is used when the user clicks on the delete button for the active category.
     * It does not receive any payload and deletes the active category from the list of
     * categories in the state. It also sets the active category to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onDeleteCategory: (state, { payload }: { payload: string }) => {
      if (payload) {
        state.categories = state.categories.filter(
          (category) => category.cid !== payload
        );
        state.activeCategory = null;
      }
    },
    /**
     * Resets the categories state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the categories module to its initial value, setting isLoadingCategories
     * to false and clearing the list of categories, and sets the active category
     * to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onLogoutCategories: (state) => {
      state.isLoadingCategories = false;
      state.categories = [];
      state.activeCategory = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onLoadCategories,
  onSetActiveCategory,
  onAddNewCategory,
  onDeleteCategory,
  onLogoutCategories,
} = categoriesSlice.actions;
