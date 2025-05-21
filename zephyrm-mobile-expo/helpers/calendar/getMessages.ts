export const getMessages = () => {
  return {
    previous: "<",
    next: ">",
    showMore: (total: number) => `+${total} more`,
  };
};
