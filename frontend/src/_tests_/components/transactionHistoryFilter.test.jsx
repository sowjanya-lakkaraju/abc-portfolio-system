import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionHistoryFilter from '../../components/transactionHistory/transactionHistoryFilter';

// Ensure this file is named with .jsx or is processed by Babel/Jest to support JSX syntax

describe('TransactionHistoryFilter', () => {
  const mockOnFilter = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all filter fields', () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={false} />);

    expect(screen.getByLabelText(/order reference no/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transaction type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to date/i)).toBeInTheDocument();
  });

  it('should show validation error when no filters are provided', async () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={false} />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/at least one search filter must be provided/i)).toBeInTheDocument();
    });

    expect(mockOnFilter).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid date range', async () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={false} />);

    const fromDateInput = screen.getByLabelText(/from date/i);
    const toDateInput = screen.getByLabelText(/to date/i);

    fireEvent.change(fromDateInput, { target: { value: '2024-01-31' } });
    fireEvent.change(toDateInput, { target: { value: '2024-01-01' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/from date must be before to date/i)).toBeInTheDocument();
    });
  });

  it('should call onFilter with correct data when form is valid', async () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={false} />);

    const orderRefInput = screen.getByLabelText(/order reference no/i);
    fireEvent.change(orderRefInput, { target: { value: 'ORD001' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith({
        orderRefNo: 'ORD001',
        securityName: '',
        transactionType: '',
        orderStatus: '',
        fromDate: '',
        toDate: ''
      });
    });
  });

  it('should reset form when reset button is clicked', () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={false} />);

    const orderRefInput = screen.getByLabelText(/order reference no/i);
    fireEvent.change(orderRefInput, { target: { value: 'ORD001' } });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    expect(orderRefInput).toHaveValue('');
  });

  it('should disable search button when loading', () => {
    render(<TransactionHistoryFilter onFilter={mockOnFilter} loading={true} />);

    const searchButton = screen.getByRole('button', { name: /searching.../i });
    expect(searchButton).toBeDisabled();
  });
});