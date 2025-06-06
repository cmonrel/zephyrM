/**
 * Categories store hook
 *
 * Custom hook for managing categories within the application
 *
 * @module modules/assetsModule/hooks/useCategoriesStore
 */

import { useSelector } from "react-redux";

import { Alert } from "react-native";
import { zephyrmApi } from "../../apis";
import { Category } from "../../interfaces";
import {
  onAddNewCategory,
  onDeleteCategory,
  onLoadCategories,
  onSetActiveCategory,
} from "../../store/assetsModule/categoriesSlice";
import { useAppDispatch } from "../../store/store";

/**
 * This custom hook provides functions to manage categories within the application,
 * including loading, creating, deleting, and setting an active category. The hook
 * interacts with the server to update category data and dispatches Redux actions
 * to maintain the application's state.
 *
 * Methods:
 * - `startLoadingCategories()`: Loads all categories from the server.
 * - `setActiveCategory(category)`: Sets a single category as active.
 * - `startDeletingCategory(cid)`: Deletes a category by its ID.
 * - `startSavingCategory(category)`: Creates a new category.
 *
 * @returns {object} An object containing the following properties and methods:
 * - `categories`: The list of all available categories.
 * - `activeCategory`: The currently active category.
 * - `setActiveCategory(category)`: Sets a single category as active.
 * - `startDeletingCategory(cid)`: Deletes a category by its ID.
 * - `startLoadingCategories()`: Loads all categories from the server.
 * - `startSavingCategory(category)`: Creates a new category.
 */
export const useCategoriesStore = () => {
  const dispatch = useAppDispatch();
  const { categories, activeCategory } = useSelector(
    (state: any) => state.categories
  );

  /**
   * Loads all categories from the server.
   *
   * Makes a GET request to the server to fetch all available categories.
   * If the request is successful, it dispatches the onLoadCategories action
   * with the received categories to update the application's state. If an error
   * occurs during the request, it displays an error message using Swal.fire.
   */
  const startLoadingCategories = async () => {
    try {
      const { data } = await zephyrmApi.get("categories");

      dispatch(onLoadCategories(data.categories));
    } catch (error: any) {
      Alert.alert("Error loading categories", error.response.data.msg);
    }
  };

  /**
   * Sets a single category as active.
   *
   * It dispatches the onSetActiveCategory action with the provided
   * category to update the application's state.
   *
   * @param {Object} category The category to be set as active.
   */
  const setActiveCategory = (category: Category) => {
    dispatch(onSetActiveCategory(category));
  };

  /**
   * Deletes a category by its ID.
   *
   * Makes a DELETE request to the server to delete a category with the
   * specified ID. If the request is successful, it dispatches the
   * onDeleteAsset action to update the application's state. It also shows
   * a success message. If an error occurs, it displays an error message.
   *
   * @param {string} cid - The ID of the category to delete.
   */
  const startDeletingCategory = async (cid: string) => {
    if (!cid) return;

    try {
      await zephyrmApi.delete(`categories/${cid}`);

      dispatch(onDeleteCategory(cid));
      Alert.alert("Deleted successfully", "");

      startLoadingCategories();
    } catch (error: any) {
      Alert.alert("Error deleting", error.response.data.msg);
    }
  };

  /**
   * Creates a new category.
   *
   * Makes a POST request to the server to create a new category.
   * If the request is successful, it dispatches the onAddNewCategory
   * action to update the application's state. It also shows a success
   * message. If an error occurs, it displays an error message.
   *
   * @param {String} category The category to be created.
   */
  const startSavingCategory = async (category: string) => {
    if (!category) return;
    try {
      const newCategory = {
        title: category,
      };
      await zephyrmApi.post("categories/new", newCategory);

      dispatch(onAddNewCategory(category));
      Alert.alert("Created successfully", "");

      startLoadingCategories();
    } catch (error: any) {
      Alert.alert("Error updating", error.response.data.msg);
    }
  };

  return {
    // Properties
    categories,
    activeCategory,

    // Methods
    setActiveCategory,
    startDeletingCategory,
    startLoadingCategories,
    startSavingCategory,
  };
};
