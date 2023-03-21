import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CustomerOrderDetails from '../../customers/pages/customerOrderDetails';
import { requestData } from '../../utils/apiConnection';
import renderWithRouter from '../helpers/renderWithRouter';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
  requestUpdate: jest.fn(),
}));

describe('CustomerOrderDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(
    'should render Page with all elements',
    async () => {
      requestData.mockResolvedValueOnce({
        id: '1',
        sellerName: 'Fulana Pereira',
        saleDate: '2023-03-17T19:01:14+0000',
        status: 'Entregue',
        products: [
          { id: '1', name: 'Produto 1', quantity: 2, price: '10.00' },
          { id: '2', name: 'Produto 2', quantity: 1, price: '20.00' },
        ],
        totalPrice: '40.00',
      });

      await act(async () => {
        renderWithRouter(<CustomerOrderDetails />, { route: 'customer/orders/1' });
        await waitFor(() => expect(requestData).toHaveBeenCalled());

        expect(window.location.pathname).toBe('/customer/orders/1');

        expect(screen
          .getByTestId('customer_order_details__element-order-details-label-order-id'))
          .toBeInTheDocument();

        expect(screen
          .getByTestId('customer_order_details__element-order-details-label-seller-name'))
          .toBeInTheDocument();
        expect(screen
          .getByTestId('customer_order_details__element-order-details-label-seller-name'))
          .toHaveTextContent('Fulana Pereira');

        expect(screen
          .getByTestId('customer_order_details__element-order-details-label-order-date'))
          .toBeInTheDocument();
        expect(screen
          .getByTestId('customer_order_details__element-order-details-label-order-date'))
          .toHaveTextContent('17/03/2023');

        expect(screen
          .getByTestId('customer_order_details__button-delivery-check'))
          .toBeInTheDocument();

        expect(screen
          .getByTestId('customer_order_details__element-order-total-price'))
          .toBeInTheDocument();
        expect(screen
          .getByTestId('customer_order_details__element-order-total-price'))
          .toHaveTextContent('40');

        expect(screen
          .getByTestId('customer_order_details__button-delivery-check'))
          .toBeInTheDocument();

        expect(screen.getByTestId(/customer_order_details__element-order-table-item-number-0/i))
          .toBeInTheDocument();
        expect(screen.getByTestId(/customer_order_details__element-order-table-name-0/i))
          .toBeInTheDocument();
        expect(screen.getByTestId(/customer_order_details__element-order-table-quantity-0/i))
          .toBeInTheDocument();
        expect(screen.getByTestId(/customer_order_details__element-order-table-unit-price-0/i))
          .toBeInTheDocument();
        expect(screen.getByTestId(/customer_order_details__element-order-table-sub-total-0/i))
          .toBeInTheDocument();
        expect(screen.getByTestId(/customer_order_details__element-order-table-sub-total-0/i))
          .toHaveTextContent('20,00');
      });
    },
  );
});
