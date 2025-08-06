export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface ListResponse<T> extends BaseResponse {
  data: T[];
}

export interface SingleResponse<T> extends BaseResponse {
  data: T;
}
