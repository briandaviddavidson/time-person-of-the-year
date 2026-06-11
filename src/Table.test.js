import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from './Table';

const people = [
  { name: 'Bravo', year: '1990', honor: 'Person of the year', birth: '1950', death: '' },
  { name: 'Alpha', year: '1980', honor: 'Man of the year', birth: '1940', death: '2000' },
];

test('renders a header button and a row per person', () => {
  render(<Table people={people} />);
  expect(screen.getByRole('button', { name: /^Name/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Alpha' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Bravo' })).toBeInTheDocument();
});

test('renders honor as a badge', () => {
  render(<Table people={people} />);
  expect(screen.getByText('Man of the year')).toBeInTheDocument();
});

test('clicking a column header sorts and sets aria-sort', async () => {
  const user = userEvent.setup();
  render(<Table people={people} />);

  // default order follows the input array: Bravo first
  let rows = screen.getAllByRole('row').slice(1); // drop header row
  expect(within(rows[0]).getByRole('link')).toHaveTextContent('Bravo');

  await user.click(screen.getByRole('button', { name: /^Name/ }));

  const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
  expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

  rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[0]).getByRole('link')).toHaveTextContent('Alpha');
});
