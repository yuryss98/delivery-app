import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import renderWithRouter from '../helpers/renderWithRouter';
import { requestData } from '../../utils/apiConnection';
import SellerOrder from '../../seller/pages/sellerOrder';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Seller Orders Page', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('renders SellerOrders page', async () => {
    requestData.mockResolvedValue(
      [
        {
          id: 1,
          totalPrice: '10.00',
          deliveryAddress: 'Rua A',
          deliveryNumber: '123',
          saleDate: '2023-03-17T17:41:04.000Z',
          status: 'Pendente',
          sellerName: 'Fulana Pereira',
          sellerEmail: 'fulana@deliveryapp.com',
        },
      ],
    );
    await act(async () => {
      renderWithRouter(<SellerOrder />, { route: '/seller/orders' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      expect(screen.getByTestId('seller_orders__element-order-id-1'))
        .toHaveTextContent('Pedido 1');

      expect(screen.getByTestId('seller_orders__element-delivery-status-1'))
        .toBeInTheDocument();
      expect(screen.getByTestId('seller_orders__element-delivery-status-1'))
        .toHaveTextContent('Pendente');

      expect(screen.getByTestId('seller_orders__element-order-date-1'))
        .toBeInTheDocument();
      expect(screen.getByTestId('seller_orders__element-order-date-1'))
        .toBeInTheDocument('17/03/2023');

      expect(screen.getByTestId('seller_orders__element-card-price-1'))
        .toBeInTheDocument();
      expect(screen.getByTestId('seller_orders__element-card-price-1'))
        .toBeInTheDocument('R$ 10,00');

      expect(screen.getByTestId('seller_orders__element-card-address-1'))
        .toBeInTheDocument();
      expect(screen.getByTestId('seller_orders__element-card-address-1'))
        .toHaveTextContent('Rua A, 123');
    });
  });
  it('should redirect if clicked in a order', async () => {
    const navigate = jest.fn();
    requestData.mockResolvedValue(
      [
        {
          id: 1,
          totalPrice: '10.00',
          deliveryAddress: 'Rua A',
          deliveryNumber: '123',
          saleDate: '2023-03-17T17:41:04.000Z',
          status: 'Pendente',
          sellerName: 'Fulana Pereira',
          sellerEmail: 'fulana@deliveryapp.com',
        },
      ],
    );
    useNavigate.mockReturnValue(navigate);
    await act(async () => {
      renderWithRouter(<SellerOrder />, { route: '/seller/orders' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      await userEvent.click(screen.getByTestId('seller_orders__element-order-id-1'));

      expect(navigate).toHaveBeenCalledWith('/seller/orders/1');
    });
  });
});
