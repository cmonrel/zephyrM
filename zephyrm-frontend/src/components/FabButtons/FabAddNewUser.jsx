/**
 * FabAddNewUser Component
 *
 * This component represents a floating action button (FAB) for adding new users.
 *
 * @module components/FabButtons/FabAddNewUser
 */

import { useUIStore } from "../../ui/hooks/useUiStore";
import { useUsersStore } from "../../modules/users/hooks/useUsersStore";

/**
 * Floating action button (FAB) component for adding new users.
 *
 * This component renders a button that, when clicked, resets the active user
 * to a default state and opens the user modal for creating or editing users.
 *
 * @function FabAddNewUser
 * @returns {JSX.Element} The FAB component.
 */
export const FabAddNewUser = () => {
  const { openUserModal } = useUIStore();
  const { setActiveUser } = useUsersStore();

  /**
   * Handles the click event on the add new user FAB.
   * Resets the active user and opens the user modal.
   */
  const handleClickNew = () => {
    setActiveUser({
      name: "",
      role: "",
      email: "",
      password: "",
    });

    openUserModal();
  };
  return (
    <button className="btn btn-primary fab" onClick={() => handleClickNew()}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
