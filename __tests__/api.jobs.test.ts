import { GET } from '@/app/api/jobs/route';
import { NextRequest } from 'next/server';

global.fetch = jest.fn();

describe('GET /api/jobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return job results from the API', async () => {
    // Mock token request
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'fake-token' }),
    });

    // Mock job search request
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultats: [{ intitule: 'Développeur Web', description: 'Job description' }] }),
    });

    const request = new NextRequest('http://localhost/api/jobs?search=développeur&location=62041');
    const response = await GET(request);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].intitule).toBe('Développeur Web');
  });

  it('should return 500 on token fetch error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const request = new NextRequest('http://localhost/api/jobs');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
