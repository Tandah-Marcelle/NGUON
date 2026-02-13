const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  },

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  },

  async uploadFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload/media`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },

  async createMedia(data: {
    type: string;
    url: string;
    title: string;
    description?: string;
    published: boolean;
  }) {
    return this.post('/mediatheque', data);
  },

  async getMediaItems(): Promise<any[]> {
    return this.get('/mediatheque');
  },

  async getPresignedUrl(fileName: string): Promise<{ presignedUrl: string }> {
    return this.get(`/files/presigned-url?fileName=${encodeURIComponent(fileName)}`);
  },
};
