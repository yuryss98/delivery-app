import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import CustomerCheckout from '../../customers/pages/customerCheckout';
import { requestData, requestLogin } from '../../utils/apiConnection';
import renderWithRouter from '../helpers/renderWithRouter';

jest.mock('../../utils/apiConnection', () => ({
  requestLogin: jest.fn(),
  requestData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CustomerCheckout', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  it('renders the page title', async () => {
    requestData.mockResolvedValueOnce([]);

    await act(async () => {
      renderWithRouter(<CustomerCheckout />, { route: '/customer/checkout' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const navBarElement = screen.getByRole('navigation');
      expect(navBarElement).toBeInTheDocument();

      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toHaveTextContent('usuario');

      expect(screen.getByTestId('customer_checkout__element-order-total-price'))
        .toHaveTextContent('0,00');

      expect(screen.getByTestId('customer_checkout__button-submit-order'))
        .toBeInTheDocument();

      expect(screen.getByTestId('customer_checkout__select-seller'))
        .toBeInTheDocument();

      expect(screen.getByTestId('customer_checkout__input-address'))
        .toBeInTheDocument();

      expect(screen.getByTestId('customer_checkout__input-address-number'))
        .toBeInTheDocument();
    });
  });
  it('calculates total price correctly', async () => {
    const cartItems = [
      { id: 1, name: 'Product 1', price: '5.00', quantity: 2 },
      { id: 2, name: 'Product 2', price: '10.00', quantity: 1 },
      { id: 3, name: 'Product 3', price: '3.50', quantity: 3 },
    ];
    localStorage.setItem('cart', JSON.stringify(cartItems));
    requestData.mockResolvedValueOnce([]);

    await act(async () => {
      renderWithRouter(<CustomerCheckout />, { route: 'customer/checkout' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      expect(screen.getByTestId(/customer_checkout__element-order-table-item-number-0/i))
        .toBeInTheDocument();
      expect(screen.getByTestId(/customer_checkout__element-order-table-name-0/i))
        .toBeInTheDocument();
      expect(screen.getByTestId(/customer_checkout__element-order-table-quantity-0/i))
        .toBeInTheDocument();
      expect(screen.getByTestId(/customer_checkout__element-order-table-unit-price-0/i))
        .toBeInTheDocument();
      expect(screen.getByTestId(/customer_checkout__element-order-table-sub-total-0/i))
        .toBeInTheDocument();
      expect(screen.getByTestId(/customer_checkout__element-order-table-remove-0/i))
        .toBeInTheDocument();

      expect(screen.getByTestId('customer_checkout__element-order-total-price'))
        .toHaveTextContent('30,50');
    });
  });
  it(
    'should call handleButton function when "FINALIZAR PEDIDO" button is clicked',
    async () => {
      const saleId = 1;
      const navigate = jest.fn();

      const cartItems = [
        { id: 1, name: 'Product 1', price: '5.00', quantity: 2 },
        { id: 2, name: 'Product 2', price: '10.00', quantity: 1 },
        { id: 3, name: 'Product 3', price: '3.50', quantity: 3 },
      ];
      localStorage.setItem('cart', JSON.stringify(cartItems));
      useNavigate.mockReturnValue(navigate);
      requestLogin.mockResolvedValueOnce(saleId);
      requestData.mockResolvedValueOnce([
        {
          id: 2,
          name: 'Fulana Pereira',
          role: 'seller',
          email: 'fulana@deliveryapp.com',
        },
      ]);

      await act(async () => {
        renderWithRouter(<CustomerCheckout />, { route: 'customer/checkout' });
        await waitFor(() => expect(requestData).toHaveBeenCalled());

        const address = screen.getByTestId('customer_checkout__input-address');
        const addressNum = screen.getByTestId('customer_checkout__input-address-number');
        const selectSeller = screen.getByTestId('customer_checkout__select-seller');
        const btn = screen.getByTestId('customer_checkout__button-submit-order');

        await userEvent.type(address, 'Rua');

        await userEvent.type(addressNum, '123');

        await userEvent.selectOptions(selectSeller, '2');

        await userEvent.click(btn);

        expect(requestLogin).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith('/customer/orders/1');
      });
    },
  );
});
