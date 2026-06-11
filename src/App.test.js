import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the TIME masthead', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /TIME/i, level: 1 })).toBeInTheDocument();
  expect(
    screen.getByText('Person of the Year', { selector: '.masthead__subtitle' })
  ).toBeInTheDocument();
});

test('renders the "Beyond the table" visualizations section', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /Beyond the table/i, level: 2 })
  ).toBeInTheDocument();
});
