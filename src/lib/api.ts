const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type PageResponse<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number };

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra };
}

export const api = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
  },

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  },

  async uploadFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/media`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  async uploadSiteFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/site`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  async uploadActivityFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/activity`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  async uploadProgrammeFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/programme`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  async uploadActualityFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/actuality`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
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

  async updateMedia(id: number, data: { type: string; url: string; title: string; description?: string; published: boolean }) {
    const response = await fetch(`${API_BASE_URL}/mediatheque/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteMedia(id: number) {
    const response = await fetch(`${API_BASE_URL}/mediatheque/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async deleteFile(fileName: string) {
    const response = await fetch(`${API_BASE_URL}/files/delete?fileName=${encodeURIComponent(fileName)}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('File delete failed');
  },

  async getMediaById(id: number): Promise<any> {
    return this.get(`/mediatheque/${id}`);
  },

  async createProgramme(data: any) {
    return this.post('/programmes', data);
  },

  async updateProgramme(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/programmes/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
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
    const response = await fetch(`${API_BASE_URL}/programmes/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getMediaItems(): Promise<any[]> {
    return this.get('/mediatheque');
  },

  async getMediaItemsPaged(page: number, size: number, search?: string): Promise<PageResponse<any>> {
    const q = new URLSearchParams({ page: String(page), size: String(size), ...(search ? { search } : {}) });
    return this.get(`/mediatheque/paged?${q}`);
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

  async updateMessage(id: number, data: { authorityTitle: string; content: string; published: boolean }) {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteMessage(id: number) {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getActivities(): Promise<any[]> {
    return this.get('/activities');
  },

  async getActivitiesPaged(page: number, size: number, search?: string): Promise<PageResponse<any>> {
    const q = new URLSearchParams({ page: String(page), size: String(size), ...(search ? { search } : {}) });
    return this.get(`/activities/paged?${q}`);
  },

  async getActivityById(id: number): Promise<any> {
    return this.get(`/activities/${id}`);
  },

  async createActivity(data: {
    name: string;
    description: string;
    image: string;
    displayOrder: number;
    published: boolean;
  }) {
    return this.post('/activities', data);
  },

  async updateActivity(id: number, data: { name: string; description: string; image: string; displayOrder: number; published: boolean }) {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteActivity(id: number) {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getContacts(): Promise<any[]> {
    return this.get('/contacts');
  },

  async getContactsPaged(page: number, size: number, search?: string): Promise<PageResponse<any>> {
    const q = new URLSearchParams({ page: String(page), size: String(size), ...(search ? { search } : {}) });
    return this.get(`/contacts/paged?${q}`);
  },

  async getContactById(id: number): Promise<any> {
    return this.get(`/contacts/${id}`);
  },

  async respondToContact(id: number, message: string) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}/respond`, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ message }) });
    if (!response.ok) throw new Error('Response failed');
    return response.text();
  },

  async deleteContact(id: number) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, { method: 'DELETE', headers: authHeaders() });
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
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteRole(id: number) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, { method: 'DELETE', headers: authHeaders() });
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
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getSites(): Promise<any[]> {
    return this.get('/manifestation-sites');
  },

  async getSiteById(id: number): Promise<any> {
    return this.get(`/manifestation-sites/${id}`);
  },

  async createSite(data: { image: string; townTitle: string; subTownTitles: string[]; published: boolean }) {
    return this.post('/manifestation-sites', data);
  },

  async updateSite(id: number, data: { image: string; townTitle: string; subTownTitles: string[]; published: boolean }) {
    const response = await fetch(`${API_BASE_URL}/manifestation-sites/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteSite(id: number) {
    const response = await fetch(`${API_BASE_URL}/manifestation-sites/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getActualities(): Promise<any[]> {
    return this.get('/actualities');
  },

  async getActualitiesPaged(page: number, size: number, search?: string): Promise<PageResponse<any>> {
    const q = new URLSearchParams({ page: String(page), size: String(size), ...(search ? { search } : {}) });
    return this.get(`/actualities/paged?${q}`);
  },

  async getActualityById(id: number): Promise<any> {
    return this.get(`/actualities/${id}`);
  },

  async createActuality(data: {
    title: string;
    description: string;
    media: string;
    published: boolean;
  }) {
    return this.post('/actualities', data);
  },

  async updateActuality(id: number, data: { title: string; description: string; media: string; published: boolean }) {
    const response = await fetch(`${API_BASE_URL}/actualities/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteActuality(id: number) {
    const response = await fetch(`${API_BASE_URL}/actualities/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getSponsors(): Promise<any[]> {
    return this.get('/sponsors');
  },

  async getSponsorById(id: number): Promise<any> {
    return this.get(`/sponsors/${id}`);
  },

  async createSponsor(data: { name: string; image: string }) {
    return this.post('/sponsors', data);
  },

  async updateSponsor(id: number, data: { name: string; image: string }) {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteSponsor(id: number) {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  // ─── CONCOURS ────────────────────────────────────────────────────────────────

  async getConcours(): Promise<any[]> {
    return this.get('/concours');
  },

  async getConcoursById(id: number): Promise<any> {
    return this.get(`/concours/${id}`);
  },

  async createConcours(data: { categorie: string; sousCategorie: string; periode: string; affiche?: string }): Promise<any> {
    return this.post('/concours', data);
  },

  async updateConcours(id: number, data: { categorie: string; sousCategorie: string; periode: string; affiche?: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/concours/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteConcours(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/concours/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async soumettreConcours(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/concours/${id}/soumettre`, { method: 'PUT', headers: authHeaders() });
    if (!response.ok) throw new Error('Soumettre failed');
    return response.json();
  },

  async unsoumettreConcours(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/concours/${id}/unsoumettre`, { method: 'PUT', headers: authHeaders() });
    if (!response.ok) throw new Error('Unsoumettre failed');
    return response.json();
  },

  async addFicheConcours(concoursId: number, data: { titre: string; fichierPdf: string }): Promise<any> {
    return this.post(`/concours/${concoursId}/fiches`, data);
  },

  async deleteFicheConcours(ficheId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/concours/fiches/${ficheId}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async uploadConcoursAffiche(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/concours/affiche`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async uploadConcoursFiche(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/concours/fiche`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  // ─── PUBLIC (no auth) ─────────────────────────────────────────────────────────

  async getConcoursPublic(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/concours/public`);
    if (!response.ok) throw new Error('Failed');
    return response.json();
  },

  async uploadCandidatDocument(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/candidat/document`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async uploadCandidatSignature(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/candidat/signature`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  async souscrireCandidat(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/candidats/souscrire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Inscription failed');
    }
    return response.json();
  },

  // ─── CANDIDATS ───────────────────────────────────────────────────────────────

  async getCandidats(): Promise<any[]> {
    return this.get('/candidats');
  },

  async getCandidatById(id: number): Promise<any> {
    return this.get(`/candidats/${id}`);
  },

  async getCandidatsByConcoursId(concoursId: number): Promise<any[]> {
    return this.get(`/candidats/concours/${concoursId}`);
  },

  async getCandidatDocuments(id: number): Promise<any[]> {
    return this.get(`/candidats/${id}/documents`);
  },

  async getCandidatParticipations(id: number): Promise<any[]> {
    return this.get(`/candidats/${id}/participations`);
  },

  async uploadSponsorFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/sponsor`, { method: 'POST', headers: authHeaders(), body: formData });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  // ─── BOOKING PROPERTIES ───────────────────────────────────────────────────────

  async getBookingProperties(): Promise<any[]> {
    return this.get('/booking-properties');
  },

  async getBookingPropertiesAdmin(): Promise<any[]> {
    return this.get('/booking-properties/admin');
  },

  async getBookingPropertyById(id: number): Promise<any> {
    return this.get(`/booking-properties/${id}`);
  },

  async createBookingProperty(data: {
    category: string;
    name: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    priceFrom?: string;
    priceTo?: string;
    priceUnit?: string;
    stars?: number;
    cuisine?: string;
    openingHours?: string;
    features: string[];
    accentColor?: string;
    featured: boolean;
    published: boolean;
  }): Promise<any> {
    return this.post('/booking-properties', data);
  },

  async updateBookingProperty(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/booking-properties/${id}`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteBookingProperty(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/booking-properties/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getBookingMediaByProperty(propertyId: number): Promise<any[]> {
    return this.get(`/booking-properties/${propertyId}/media`);
  },

  async addBookingMedia(propertyId: number, data: { type: string; url: string; alt?: string }): Promise<any> {
    return this.post(`/booking-properties/${propertyId}/media`, data);
  },

  async deleteBookingMedia(mediaId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/booking-media/${mediaId}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Delete failed');
  },

  async uploadBookingFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/booking`, {
      method: 'POST', headers: authHeaders(), body: formData,
    });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  // ─── SHOP ───────────────────────────────────────────────────────────────────

  async getShopCategories(): Promise<any[]> {
    return this.get('/shop-categories');
  },

  async createShopCategory(data: { key: string; label: string; icon?: string; description?: string; displayOrder?: number }): Promise<any> {
    return this.post('/shop-categories', data);
  },

  async updateShopCategory(id: number, data: { key: string; label: string; icon?: string; description?: string; displayOrder?: number }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/shop-categories/${id}`, {
      method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteShopCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shop-categories/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getShopProducts(): Promise<any[]> {
    return this.get('/shop-products');
  },

  async getShopProductsAdmin(): Promise<any[]> {
    return this.get('/shop-products/admin');
  },

  async getShopProductById(id: number): Promise<any> {
    return this.get(`/shop-products/${id}`);
  },

  async createShopProduct(data: any): Promise<any> {
    return this.post('/shop-products', data);
  },

  async updateShopProduct(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/shop-products/${id}`, {
      method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteShopProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shop-products/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async uploadShopFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/shop`, {
      method: 'POST', headers: authHeaders(), body: formData,
    });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  async createShopOrder(data: any): Promise<any> {
    // Public — created by the storefront checkout flow, no auth header required.
    const response = await fetch(`${API_BASE_URL}/shop-orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Order creation failed');
    return response.json();
  },

  async getShopOrders(): Promise<any[]> {
    return this.get('/shop-orders');
  },

  async getShopOrderById(id: string): Promise<any> {
    return this.get(`/shop-orders/${id}`);
  },

  async updateShopOrderStatus(id: string, data: { status?: string; paymentStatus?: string; paymentId?: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/shop-orders/${id}/status`, {
      method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteShopOrder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shop-orders/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  // ─── CAMPAY (MTN Mobile Money / Orange Money) ─────────────────────────────────

  async campayCollect(data: { amount: number; phone: string; description: string; externalReference: string }): Promise<{
    success: boolean; reference?: string; ussdCode?: string; operator?: string; message?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/payments/campay/collect`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Payment initiation failed');
    return response.json();
  },

  async campayStatus(reference: string): Promise<{
    reference: string; status: string; amount?: number; operator?: string; message?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/payments/campay/status/${reference}`);
    if (!response.ok) throw new Error('Status check failed');
    return response.json();
  },

  // ─── VOTE PROFILES (Miss/Master gallery) ──────────────────────────────────────

  async getVoteProfiles(): Promise<any[]> {
    return this.get('/vote-profiles');
  },

  async getVoteProfilesAdmin(): Promise<any[]> {
    return this.get('/vote-profiles/admin');
  },

  async getVoteProfileById(id: number): Promise<any> {
    return this.get(`/vote-profiles/${id}`);
  },

  async createVoteProfile(data: any): Promise<any> {
    return this.post('/vote-profiles', data);
  },

  async updateVoteProfile(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vote-profiles/${id}`, {
      method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  async deleteVoteProfile(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vote-profiles/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!response.ok) throw new Error('Delete failed');
  },

  async getVoteProfileVoters(id: number): Promise<{ email: string; verifiedAt: string }[]> {
    return this.get(`/vote-profiles/${id}/voters`);
  },

  async uploadVoteProfileFile(file: File): Promise<{ fileName: string; presignedUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/files/upload/vote-profile`, {
      method: 'POST', headers: authHeaders(), body: formData,
    });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  },

  // ─── VOTES (public — email + OTP confirmation) ────────────────────────────────

  async requestVoteOtp(data: { voteProfileId: number; email: string }): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/votes/request-otp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  async confirmVoteOtp(data: { email: string; otp: string }): Promise<{ success: boolean; message?: string; profileName?: string }> {
    const response = await fetch(`${API_BASE_URL}/votes/confirm-otp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
};
