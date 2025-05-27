/**
 * ZephyrMApp Component
 *
 * This component wraps the entire application
 *
 * @module ZephyrMApp
 */

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { AppRouter } from "./router/AppRouter";
import { store } from "./store";

/**
 * ZephyrMApp Component
 *
 * This component wraps the entire application with
 * react-redux's Provider and react-router-dom's BrowserRouter.
 * It also renders the AppRouter component which defines
 * the routes and navigation for the application.
 *
 * @returns {ReactElement} The rendered application.
 */
export const ZephyrMApp = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </>
  );
};
