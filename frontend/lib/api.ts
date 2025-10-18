const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProjects(page = 1) {
  try {
    const response = await fetch(`${API_URL}/projects/approved?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Fetch projects error:', error);
    throw error;
  }
}

export async function fetchProjectById(id: string) {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Project not found');
    return await response.json();
  } catch (error) {
    console.error('Fetch project error:', error);
    throw error;
  }
}

export async function searchProjects(
  query: string,
  year?: number,
  department?: string,
  page = 1
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    if (query) params.append('query', query);
    if (year) params.append('year', year.toString());
    if (department) params.append('department', department);

    const response = await fetch(`${API_URL}/projects/search?${params}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function uploadProject(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/projects/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function downloadProject(projectId: string) {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}/download`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Download failed');
    return response;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

export async function addComment(projectId: string, staffName: string, staffEmail: string, comment: string) {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffName, staffEmail, comment }),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  } catch (error) {
    console.error('Add comment error:', error);
    throw error;
  }
}

export async function addRating(projectId: string, rating: number) {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    if (!response.ok) throw new Error('Failed to add rating');
    return await response.json();
  } catch (error) {
    console.error('Add rating error:', error);
    throw error;
  }
}

// Admin API calls
export async function adminLogin(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
}

export async function getPendingProjects(token: string, page = 1) {
  try {
    const response = await fetch(`${API_URL}/admin/pending?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch pending projects');
    return await response.json();
  } catch (error) {
    console.error('Get pending error:', error);
    throw error;
  }
}

export async function approveProject(projectId: string, token: string) {
  try {
    const response = await fetch(`${API_URL}/admin/${projectId}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to approve project');
    return await response.json();
  } catch (error) {
    console.error('Approve error:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string, token: string) {
  try {
    const response = await fetch(`${API_URL}/admin/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export async function getAdminStats(token: string) {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Stats error:', error);
    throw error;
  }
}
