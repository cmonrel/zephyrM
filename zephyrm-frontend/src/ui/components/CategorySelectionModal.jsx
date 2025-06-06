/**
 * Category Selection Modal Component
 *
 * This component displays a modal for selecting the category.
 *
 * @module ui/components/CategorySelectionModal
 */

import Modal from "react-modal";

import { useEffect, useState } from "react";

import { useUIStore } from "../hooks/useUiStore";
import { useCategoriesStore } from "../../modules/assetsModule/hooks/useCategoriesStore";
import { SearchBar } from "../../components";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-0%, -15%)",
  },
};

/**
 * Displays a modal for selecting a category.
 *
 * This component renders a modal with a list of categories that can be selected.
 * When a category is selected, the `onSelect` function is called with the
 * selected category as its argument.
 *
 * @param {function} onSelect - The function to call when a category is selected.
 * @returns {ReactElement} The rendered modal component.
 */
export const CategorySelectionModal = ({ onSelect }) => {
  const { isCategorySelectionModalOpen, closeCategorySelectionModal } =
    useUIStore();
  const {
    categories,
    startDeletingCategory,
    startSavingCategory,
    startLoadingCategories,
  } = useCategoriesStore();

  const [filteredCategories, setFilteredCategories] = useState(categories);

  const [formValues, setFormValues] = useState({
    title: "",
  });

  /**
   * Updates the form values when an input element changes.
   *
   * @param {{ target: HTMLInputElement }} event - The event object associated with the input element change.
   * @param {string} event.target.name - The name of the input element that changed.
   * @param {string} event.target.value - The new value of the input element that changed.
   */
  const onChangeInput = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  /**
   * Closes the category selection modal.
   */
  const onCloseModal = () => {
    closeCategorySelectionModal();
  };

  /**
   * Deletes a category by its ID.
   *
   * @param {Object} category - The category to delete, with a `cid` property.
   */
  const onDeleteCategory = (category) => {
    startDeletingCategory(category.cid);
  };

  /**
   * Handles the search for categories by title.
   *
   * This function takes a search term as a string and filters the list of categories
   * based on the search term. It does a case insensitive search on the following
   * properties of the category object:
   *
   * - `title`
   *
   * If the search term is found in any of these properties, the category is
   * included in the filtered list. The filtered list is then set as the
   * new state of the component.
   *
   * @param {string} searchTerm The search term to filter the categories by.
   */
  const handleUserSearch = (searchTerm) => {
    const result = categories.filter((category) =>
      category.title.toLowerCase().includes(searchTerm)
    );
    setFilteredCategories(result);
  };

  /**
   * Creates a new category.
   *
   * Makes a POST request to the server to create a new category.
   * If the request is successful, it dispatches the onAddNewCategory
   * action to update the application's state. It also shows a success
   * message. If an error occurs, it displays an error message.
   *
   * @param {String} cate The title of the category to be created.
   */
  const handleSave = (cate) => {
    startSavingCategory(cate);
  };

  /**
   * Loads the list of categories when the component mounts.
   */
  useEffect(() => {
    startLoadingCategories();
  }, []);

  /**
   * Sets the filtered categories to the list of all categories when the component mounts
   * or when the list of categories changes.
   */
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  return (
    <Modal
      isOpen={isCategorySelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
      overlayClassName={"modal-fondo"}
    >
      <h2 className="selection-modal-title">Select Category</h2>

      <SearchBar onSearch={handleUserSearch} placeholder="Search category..." />

      <div className="selection-list">
        <div style={{ display: "row" }}>
          <input
            type="text"
            placeholder="New Category"
            style={{ height: "100%" }}
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onChangeInput}
          />
          &nbsp;
          <button
            type="submit"
            className="btn btn-outline-primary"
            style={{ width: "50%", height: "100%" }}
            onClick={() => handleSave(formValues.title)}
          >
            Add
          </button>
        </div>

        {filteredCategories.length === 0 ? (
          <p>No categories found</p>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.title}
              className="selection-item"
              onClick={() => onSelect({ category: category.title })}
            >
              <p>{category.title}</p>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDeleteCategory(category)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
