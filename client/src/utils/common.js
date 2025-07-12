export const getErrorMessage = (error) => {
  const errorMessage = error.response?.data?.error_message || error.message;

  return errorMessage || "Something went wrong";
};
