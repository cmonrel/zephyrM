/**
 * Assets Page Component
 *
 * This component represents the main page for managing assets for admins.
 *
 * @module modules/assetsModule/pages/AssetsPage
 */

import { useEffect, useState } from "react";
import "./AssetsPage.css";

import { AssetModal } from "../../../ui/components/AssetModal";
import { useAssetsStore } from "../";
import { AssetDetailsModal, AssignModal, useUIStore } from "../../../ui";
import { FabAddNewAsset } from "../../../components/FabButtons/FabAddNewAsset";
import { useUsersStore } from "../../users/hooks/useUsersStore";
import { SearchBar } from "../../../components";
import { useAuthStore } from "../../../auth/hooks/useAuthStore";
import { useCategoriesStore } from "../hooks/useCategoriesStore";

/**
 * It displays a table with all the assets, and allows the user to search, create, edit, assign, or delete them.
 *
 * @returns {JSX.Element} The assets page component.
 */
export const AssetsPage = () => {
  const {
    activeAsset,
    assets,
    startLoadingAssets,
    setActiveAsset,
    startDeletingAsset,
    startDownloadingAssetsFile,
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
  const { user } = useAuthStore();
  const { startLoadingCategories } = useCategoriesStore();

  const [filteredAssets, setFilteredAssets] = useState(assets);

  /**
   * Returns the color based on the asset state.
   *
   * This function takes an asset state as a string and returns a color string
   * based on the state. The colors are defined as follows:
   *
   * - `Free`: #4caf50
   * - `On loan`: #fbc02d
   * - `Under maintenance`: #03a9f4
   * - `Broken`: #f44336
   * - Default: #757575
   *
   * @param {string} state The asset state.
   * @returns {string} The color string based on the state.
   */
  const getStateColor = (state) => {
    switch (state) {
      case "Free":
        return "#4caf50";
      case "On loan":
        return "#fbc02d";
      case "Under maintenance":
        return "#03a9f4";
      case "Broken":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  /**
   * Handles the search for assets by title, category, location, state, or assigned user.
   *
   * This function takes a search term as a string and filters the list of assets
   * based on the search term. It does a case insensitive search on the following
   * properties of the asset object:
   *
   * - `title`
   * - `category`
   * - `location`
   * - `state`
   * - `user.name` (if the user is assigned to the asset)
   *
   * If the search term is found in any of these properties, the asset is
   * included in the filtered list. The filtered list is then set as the
   * new state of the component.
   *
   * @param {string} searchTerm The search term to filter the assets by.
   */
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

  /**
   * Handles the edit event for an asset.
   *
   * This function takes an asset object as an argument and sets the
   * active asset to the given asset. It then opens the asset modal
   * for editing the asset.
   *
   * @param {Object} asset The asset object to edit.
   */
  const handleEdit = (asset) => {
    setActiveAsset(asset);
    openAssetModal();
  };

  /**
   * Deletes an asset.
   *
   * This function takes an asset ID as an argument and initiates the
   * process for deleting that asset by calling the appropriate function
   * to handle server communication and state updates.
   *
   * @param {string} aid The ID of the asset to delete.
   */
  const handleDelete = (aid) => {
    startDeletingAsset(aid);
  };

  /**
   * Assigns a user to an asset.
   *
   * This function takes an asset object as an argument and sets the
   * active asset to the given asset. It then opens the assign modal
   * to select a user to assign to the asset.
   *
   * @param {Object} asset The asset object to assign to a user.
   */
  const handleAssign = (asset) => {
    setActiveAsset(asset);
    openAssignModal();
  };

  /**
   * Sets the provided asset as active.
   *
   * This function takes an asset object as an argument and updates
   * the application's state to set this asset as the active asset.
   *
   * @param {Object} asset The asset object to be set as active.
   */

  const handleClick = (asset) => {
    setActiveAsset(asset);
  };

  /**
   * Handles the double-click event for an asset.
   *
   * This function opens the asset details modal,
   * allowing the user to view more information about the selected asset.
   */

  const handleDoubleClick = () => {
    openAssetsDetailsModal();
  };

  /**
   * Initiates the download of all assets as an Excel file.
   *
   * This function triggers the process to download an Excel file
   * containing all available assets. It calls the function responsible
   * for server communication and file handling to execute the download.
   */
  const handleDownloadXLSX = () => {
    startDownloadingAssetsFile();
  };

  /**
   * Loads users, assets and categories when the component mounts.
   */
  useEffect(() => {
    startLoadingUsers();
    startLoadingAssets();
    startLoadingCategories();
  }, []);

  /**
   * Updates the filtered assets list whenever the assets state changes.
   */
  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  return (
    <div className="assets-management-container">
      <h2 className="page-title">Assets Management</h2>

      <SearchBar onSearch={handleAssetSearch} placeholder="Search assets..." />

      <button className="btn download-btn" onClick={handleDownloadXLSX}>
        Download Excel File
      </button>

      <div className="table-container">
        {filteredAssets.length === 0 ? (
          <h2>No results found</h2>
        ) : (
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
                  style={
                    asset.user === user.uid
                      ? { backgroundColor: "#e0f7fa" }
                      : {}
                  }
                >
                  <td>{index + 1}</td>
                  <td>{asset.title}</td>
                  <td>{asset.category}</td>
                  <td
                    style={{
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {asset.description}
                  </td>
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
                  <td style={{ color: getStateColor(asset.state) }}>
                    {asset.state}
                  </td>
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
                      onClick={() => handleDelete(asset.aid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detaisl Asset Modal */}
      {isAssetDetailsModalOpen && <AssetDetailsModal asset={activeAsset} />}

      {/* Edit Asset Modal */}
      {isAssetModalOpen && <AssetModal />}

      {/* Assign User to Asset Modal */}
      {isAssignModalOpen && <AssignModal />}

      <FabAddNewAsset />
    </div>
  );
};
