import { useUIStore } from "../../ui/hooks/useUiStore";
import { useUsersStore } from "../../modules/users/hooks/useUsersStore";

export const FabAddNewUser = () => {
  const { openUserModal } = useUIStore();
  const { setActiveUser } = useUsersStore();

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
