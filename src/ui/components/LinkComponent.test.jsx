import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LinkComponent from './LinkComponent';

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('LinkComponent', () => {
  it('renders internal router links correctly', () => {
    renderWithRouter(<LinkComponent to="/dashboard">Go to Dashboard</LinkComponent>);
    const linkElement = screen.getByText(/go to dashboard/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/dashboard');
  });

  it('renders external links correctly with target blank', () => {
    renderWithRouter(<LinkComponent href="https://google.com" external>Google</LinkComponent>);
    const linkElement = screen.getByText(/google/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('target')).toBe('_blank');
    expect(linkElement.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
