export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errors?: Record<string, string>;
    message?: string;
}

export interface getProjectBVHFilenamesResponse {
    filenames: string[];
}

