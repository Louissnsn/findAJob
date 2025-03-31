import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobsPage from '@/app/jobs/page';

global.fetch = jest.fn();

describe('JobsPage', () => {
  it('renders input and button', () => {
    render(<JobsPage />);
    expect(screen.getByPlaceholderText(/Mot-clé/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Code commune/)).toBeInTheDocument();
    expect(screen.getByText(/Rechercher/)).toBeInTheDocument();
  });

  it('fetches and displays jobs on search', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { intitule: 'Développeur Fullstack', description: 'Exemple description' },
      ],
    });

    render(<JobsPage />);
    fireEvent.click(screen.getByText(/Rechercher/));

    await waitFor(() => {
      expect(screen.getByText('Développeur Fullstack')).toBeInTheDocument();
    });
  });
});
