/**
 * Assets Page Component
 *
 * This component represents the main page for managing assets for workers.
 *
 * @module modules/assetsModule/pages/AssetsPage
 */

import { useEffect, useState } from "react";
import "./AssetsPage.css";

import { useAssetsStore } from "../";
import { AssetDetailsModal, useUIStore } from "../../../ui";
import { useUsersStore } from "../../users/hooks/useUsersStore";
import { SearchBar } from "../../../components";
import { useAuthStore } from "../../../auth/hooks/useAuthStore";
import { useCategoriesStore } from "../hooks/useCategoriesStore";

/**
 * It displays a table with all the assets, and allows the user to search and send requests for using them.
 *
 * @returns {JSX.Element} The assets page component.
 */
export const AssetsPageWorkers = () => {
  const { activeAsset, assets, startLoadingAssets, setActiveAsset } =
    useAssetsStore();
  const { isAssetDetailsModalOpen, openAssetsDetailsModal } = useUIStore();
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
   * Handles double click on an asset.
   *
   * When an asset is double clicked, this function sets the active asset
   * to the given asset and opens the asset details modal.
   *
   * @param {Object} asset The asset to be set as active.
   */
  const handleDoubleClick = (asset) => {
    setActiveAsset(asset);
    openAssetsDetailsModal();
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
   * Updates the filtered assets whenever the assets change.
   */
  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  return (
    <div className="assets-management-container">
      <h2 className="page-title">Assets Management</h2>

      <SearchBar onSearch={handleAssetSearch} placeholder="Search assets..." />

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
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr
                  key={asset.aid}
                  onDoubleClick={() => handleDoubleClick(asset)}
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detaisl Asset Modal */}
      {isAssetDetailsModalOpen && <AssetDetailsModal asset={activeAsset} />}
    </div>
  );
};
