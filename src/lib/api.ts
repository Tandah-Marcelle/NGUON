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

  async uploadProgrammeFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload/programme`, {
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

  async updateMedia(id: number, data: {
    type: string;
    url: string;
    title: string;
    description?: string;
    published: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/mediatheque/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteMedia(id: number) {
    const response = await fetch(`${API_BASE_URL}/mediatheque/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async deleteFile(fileName: string) {
    const response = await fetch(`${API_BASE_URL}/files/delete?fileName=${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('File delete failed');
  },

  async getMediaById(id: number): Promise<any> {
    return this.get(`/mediatheque/${id}`);
  },

  async createProgramme(data: any) {
    return this.post('/programmes', data);
  },

  async updateProgramme(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/programmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async getProgrammeById(id: number): Promise<any> {
    return this.get(`/programmes/${id}`);
  },

  async getProgrammes(): Promise<any[]> {
    return this.get('/programmes');
  },

  async deleteProgramme(id: number) {
    const response = await fetch(`${API_BASE_URL}/programmes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getMediaItems(): Promise<any[]> {
    return this.get('/mediatheque');
  },

  getMediaViewUrl(fileName: string): string {
    return `${API_BASE_URL}/files/view/${fileName}`;
  },

  async getPresignedUrl(fileName: string, expiryMinutes: number = 60): Promise<{ presignedUrl: string }> {
    return this.get(`/files/presigned-url?fileName=${encodeURIComponent(fileName)}&expiryMinutes=${expiryMinutes}`);
  },

  async getMessages(): Promise<any[]> {
    return this.get('/messages');
  },

  async getMessageById(id: number): Promise<any> {
    return this.get(`/messages/${id}`);
  },

  async createMessage(data: {
    authorityTitle: string;
    content: string;
    published: boolean;
  }) {
    return this.post('/messages', data);
  },

  async updateMessage(id: number, data: {
    authorityTitle: string;
    content: string;
    published: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteMessage(id: number) {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getActivities(): Promise<any[]> {
    return this.get('/activities');
  },

  async getActivityById(id: number): Promise<any> {
    return this.get(`/activities/${id}`);
  },

  async createActivity(data: {
    name: string;
    description: string;
    published: boolean;
  }) {
    return this.post('/activities', data);
  },

  async updateActivity(id: number, data: {
    name: string;
    description: string;
    published: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteActivity(id: number) {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getContacts(): Promise<any[]> {
    return this.get('/contacts');
  },

  async getContactById(id: number): Promise<any> {
    return this.get(`/contacts/${id}`);
  },

  async respondToContact(id: number, message: string) {
    return this.post(`/contacts/${id}/respond`, { message });
  },

  async deleteContact(id: number) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getRoles(): Promise<any[]> {
    return this.get('/roles');
  },

  async getRoleById(id: number): Promise<any> {
    return this.get(`/roles/${id}`);
  },

  async createRole(data: { name: string; description: string }) {
    return this.post('/roles', data);
  },

  async updateRole(id: number, data: { name: string; description: string }) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteRole(id: number) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getUsers(): Promise<any[]> {
    return this.get('/users');
  },

  async getUserById(id: number): Promise<any> {
    return this.get(`/users/${id}`);
  },

  async createUser(data: { username: string; password: string; email: string; role: { id: number }; active: boolean }) {
    return this.post('/users', data);
  },

  async updateUser(id: number, data: { username: string; password: string; email: string; role: { id: number }; active: boolean }) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
  },
};
