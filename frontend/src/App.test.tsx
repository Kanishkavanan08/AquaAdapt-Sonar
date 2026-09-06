import { render, screen } from '@testing-library/react';
import App from './App';

describe('AquaAdapt-Sonar Main Application', () => {
  it('renders the main application title', () => {
    render(<App />);
    
    // Check if the main header is present
    const titleElement = screen.getByText(/AquaAdapt/i);
    expect(titleElement).toBeInTheDocument();
    
    // Check if the Mission Control HUD is trying to render
    const hudElement = screen.getByText(/MISSION CONTROL HUD|ESTABLISHING UPLINK/i);
    expect(hudElement).toBeInTheDocument();
  });
});