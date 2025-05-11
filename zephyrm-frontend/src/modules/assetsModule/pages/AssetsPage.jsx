import { useEffect } from "react";
import "./AssetsPage.css";

import { AssetModal } from "../../../ui/components/AssetModal";
import { useAssetsStore } from "../";
import { AssignModal, useUIStore } from "../../../ui";
import { FabAddNewAsset } from "../../../components/FabButtons/FabAddNewAsset";
import { useUsersStore } from "../../users/hooks/useUsersStore";

export const AssetsPage = () => {
  const { assets, startLoadingAssets, setActiveAsset, startDeletingAsset } =
    useAssetsStore();
  const {
    isAssetModalOpen,
    isAssignModalOpen,
    openAssetModal,
    openAssignModal,
  } = useUIStore();
  const { users } = useUsersStore();

  const handleEdit = (asset) => {
    setActiveAsset(asset);
    openAssetModal();
  };

  const handleDeleteAll = (aid) => {
    startDeletingAsset(aid);
  };

  const handleAssign = (asset) => {
    setActiveAsset(asset);
    openAssignModal();
  };

  useEffect(() => {
    startLoadingAssets();
  }, []);

  return (
    <div className="assets-management-container">
      <h2 className="page-title">Assets Management</h2>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Acquisition Date</th>
              <th>Location</th>
              <th>State</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.aid}>
                <td>{index + 1}</td>
                <td>{asset.title}</td>
                <td>{asset.category}</td>
                <td>{asset.description}</td>
                <td>
                  {asset.acquisitionDate
                    ? new Date(asset.acquisitionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not specified"}
                </td>
                <td>{asset.location}</td>
                <td>{asset.state}</td>
                <td>
                  {users.find((user) => user.uid === asset.user)?.name ||
                    "Unassigned"}
                </td>
                <td className="actions">
                  <button
                    className="btn edit-btn"
                    onClick={() => handleEdit(asset)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn assign-btn"
                    onClick={() => handleAssign(asset)}
                  >
                    Assign
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDeleteAll(asset.aid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {isAssetModalOpen && <AssetModal />}

      {/* New Password Modal */}
      {isAssignModalOpen && <AssignModal />}

      <FabAddNewAsset />
    </div>
  );
};
