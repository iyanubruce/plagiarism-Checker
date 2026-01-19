export const itemResponse = (
  payload: any,
  p0: number,
  message = "success",
): any => ({
  status: true,
  message,
  data: payload,
});

export const listResponse = (
  payload: any[],
  p0: number,
  p1: number,
  p2: number,
  message = "success",
): any => ({
  status: true,
  message,
  data: payload,
  pageInfo: {
    totalItems: p0,
    currentPage: p1,
    totalPages: p2,
  },
});
