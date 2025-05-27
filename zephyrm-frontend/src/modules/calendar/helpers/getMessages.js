/**
 * Returns an object with the messages for the calendar
 *
 * @returns {Object} An object with the messages
 * @property {string} previous - The message for the previous button
 * @property {string} next - The message for the next button
 * @property {function(number):string} showMore - The message for the show more link
 */
export const getMessages = () => {
  return {
    previous: "<",
    next: ">",
    showMore: (total) => `+${total} more`,
  };
};
