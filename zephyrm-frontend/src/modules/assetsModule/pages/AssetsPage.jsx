import { useEffect, useState } from "react";
import "./AssetsPage.css";

import { AssetModal } from "../../../ui/components/AssetModal";
import { useAssetsStore } from "../";
import { AssetDetailsModal, AssignModal, useUIStore } from "../../../ui";
import { FabAddNewAsset } from "../../../components/FabButtons/FabAddNewAsset";
import { useUsersStore } from "../../users/hooks/useUsersStore";
import { SearchBar } from "../../../components";

export const AssetsPage = () => {
  const {
    activeAsset,
    assets,
    startLoadingAssets,
    setActiveAsset,
    startDeletingAsset,
    startDownloadingAssetsPdf,
  } = useAssetsStore();
  const {
    isAssetModalOpen,
    isAssignModalOpen,
    isAssetDetailsModalOpen,
    openAssetModal,
    openAssignModal,
    openAssetsDetailsModal,
  } = useUIStore();
  const { users, startLoadingUsers } = useUsersStore();

  const [filteredAssets, setFilteredAssets] = useState(assets);

  const handleAssetSearch = (searchTerm) => {
    const result = assets.filter((asset) => {
      const userName =
        users.find((user) => user.uid === asset.user)?.name || "Unassigned";

      return (
        asset.title.toLocaleLowerCase().includes(searchTerm) ||
        asset.category.toLocaleLowerCase().includes(searchTerm) ||
        asset.location.toLocaleLowerCase().includes(searchTerm) ||
        asset.state.toLocaleLowerCase().includes(searchTerm) ||
        userName.toLocaleLowerCase()?.includes(searchTerm)
      );
    });
    setFilteredAssets(result);
  };

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

  const handleClick = (asset) => {
    setActiveAsset(asset);
  };

  const handleDoubleClick = () => {
    openAssetsDetailsModal();
  };

  const handleDownloadPdf = () => {
    startDownloadingAssetsPdf();
  };

  useEffect(() => {
    startLoadingUsers();
    startLoadingAssets();
  }, []);

  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  return (
    <div className="assets-management-container">
      <h2 className="page-title">Assets Management</h2>

      <SearchBar onSearch={handleAssetSearch} placeholder="Search assets..." />

      <button className="btn download-btn" onClick={handleDownloadPdf}>
        Download PDF
      </button>

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
            {filteredAssets.map((asset, index) => (
              <tr
                key={asset.aid}
                onClick={() => handleClick(asset)}
                onDoubleClick={() => handleDoubleClick()}
              >
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

      {/* Detaisl Asset Modal */}
      {isAssetDetailsModalOpen && <AssetDetailsModal asset={activeAsset} />}

      {/* Edit User Modal */}
      {isAssetModalOpen && <AssetModal />}

      {/* New Password Modal */}
      {isAssignModalOpen && <AssignModal />}

      <FabAddNewAsset />
    </div>
  );
};
