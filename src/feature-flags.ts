const stage = import.meta.env.VITE_STAGE;

export const featureflag = {
  getOrderButton: stage === "dev",
};
