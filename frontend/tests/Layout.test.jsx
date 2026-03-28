import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../src/context/AppContext';
import Layout from '../src/components/Layout';

vi.mock('../src/context/AppContext', () => ({
  AppProvider: ({ children }) => children,
  useApp: () => ({
    patients: [],
    dentists: [],
    treatments: [],
    appointments: [],
    loading: false,
    error: null,
  }),
}));

describe('Layout Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <AppProvider>
          {component}
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('should render logo', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByText('dentalLINK')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(screen.getByText('Dentistas')).toBeInTheDocument();
    expect(screen.getByText('Tratamientos')).toBeInTheDocument();
    expect(screen.getByText('Citas')).toBeInTheDocument();
  });
});
