// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { full_name: string; email: string; password: string; role: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async walletAuth(walletAddress: string, fullName?: string, role?: string) {
    return this.request<{ token: string; user: any }>('/auth/wallet', {
      method: 'POST',
      body: JSON.stringify({ 
        wallet_address: walletAddress,
        full_name: fullName,
        role: role || 'OWNER'
      }),
    });
  }

  // IPFS/Asset endpoints
  async checkIpfsHealth() {
    return this.request<{ connected: boolean; apiUrl: string; version?: any; error?: string }>('/ipfs/health');
  }

  async uploadEncryptedAsset(
    encryptedFile: Blob,
    metadata: {
      title: string;
      type?: string;
      content_hash: string;
      wallet_address: string;
      assigned_nominee_id?: string;
    }
  ) {
    const formData = new FormData();
    formData.append('file', encryptedFile, metadata.title || 'encrypted.bin');
    formData.append('title', metadata.title);
    formData.append('wallet_address', metadata.wallet_address);
    if (metadata.type) formData.append('type', metadata.type);
    if (metadata.content_hash) formData.append('content_hash', metadata.content_hash);
    if (metadata.assigned_nominee_id) {
      formData.append('assigned_nominee_id', metadata.assigned_nominee_id);
    }

    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
