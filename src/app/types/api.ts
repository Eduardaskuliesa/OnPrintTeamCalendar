export interface User {
    email: string;
    name: string;
    role: string;
    color: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    color: string;
    role: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }