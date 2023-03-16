import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CustomerOrders from '../../customers/pages/CustomerOrders';
import { requestData } from '../../utils/apiConnection';
import renderWithRouter from '../helpers/renderWithRouter';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
}));

describe('CustomerOrders', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  it('renders the page title', async () => {
    requestData.mockResolvedValue([]);
    await act(async () => {
      renderWithRouter(<CustomerOrders />, { route: 'customer/orders' });

      await waitFor(() => expect(requestData).toHaveBeenCalled());

      await waitFor(() => expect(screen
        .getByTestId('customer_products__page-title')).toBeInTheDocument());
    });
  });

  it('renders the orders with correct data', async () => {
    const orders = [
      {
        id: 1,
        status: 'Entregue',
        saleDate: '2022-03-15T19:29:13.000Z',
        totalPrice: '10.00',
      },
      {
        id: 2,
        status: 'Em trânsito',
        saleDate: '2022-03-14T10:15:00.000Z',
        totalPrice: '20.50',
      },
    ];

    requestData.mockResolvedValue(orders);

    renderWithRouter(<CustomerOrders />, { route: 'customer/orders' });

    await waitFor(() => {
      expect(requestData).toHaveBeenCalled();
      expect(requestData).toHaveBeenCalledTimes(1);
      expect(screen.getAllByRole('link')).toHaveLength(2);

      const order1 = screen
        .getByTestId('customer_orders__element-order-id-1');
      const order2 = screen
        .getByTestId('customer_orders__element-order-id-2');

      expect(order1).toBeInTheDocument();
      expect(order2).toBeInTheDocument();
      expect(screen.getByText('Pedido #0001')).toBeInTheDocument();
      expect(screen.getByText('Pedido #0002')).toBeInTheDocument();

      expect(screen
        .getByTestId('customer_orders__element-delivery-status-1'))
        .toHaveTextContent('Entregue');
      expect(screen
        .getByTestId('customer_orders__element-delivery-status-2'))
        .toHaveTextContent('Em trânsito');

      expect(screen
        .getByTestId('customer_orders__element-order-date-1'))
        .toHaveTextContent('15/03/2022');
      expect(screen
        .getByTestId('customer_orders__element-order-date-2'))
        .toHaveTextContent('14/03/2022');

      expect(screen
        .getByTestId('customer_orders__element-card-price-1'))
        .toHaveTextContent('R$ 10,00');
      expect(screen
        .getByTestId('customer_orders__element-card-price-2'))
        .toHaveTextContent('R$ 20,50');
    });
  });

  it('renders the correct name in the navbar', async () => {
    requestData.mockResolvedValue([]);
    await act(async () => {
      renderWithRouter(<CustomerOrders />, { route: '/customer/orders' });

      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const navBarElement = screen.getByRole('navigation');
      expect(navBarElement).toBeInTheDocument();

      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toHaveTextContent('usuario');
    });
  });
});
