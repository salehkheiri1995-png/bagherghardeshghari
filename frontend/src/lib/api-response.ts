export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return Response.json(body, { status });
}

export function errorResponse(
  error: string,
  status = 400
): Response {
  const body: ApiResponse = {
    success: false,
    error,
  };
  return Response.json(body, { status });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): Response {
  const body: ApiResponse<T[]> = {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return Response.json(body);
}

export function extractSearchParams(request: Request) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
