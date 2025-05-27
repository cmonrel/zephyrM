/**
 * Returns an object with all the environment variables
 *
 * @returns {{}} Environment variables
 */
export const getEnvVariables = () => {
  import.meta.env;

  return {
    ...import.meta.env,
  };
};
