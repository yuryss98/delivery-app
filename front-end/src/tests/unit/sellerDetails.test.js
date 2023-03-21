import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import SellerDetails from '../../seller/pages/SellerDetails';
import { requestData, requestUpdate } from '../../utils/apiConnection';
import renderWithRouter from '../helpers/renderWithRouter';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
  requestUpdate: jest.fn(),
}));

describe('SellerOrdersDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(
    'should render Page with all elements',
    async () => {
      requestData.mockResolvedValueOnce({
        id: 1,
        totalPrice: '2.20',
        deliveryAddress: '',
        deliveryNumber: '',
        saleDate: '2023-03-17T17:41:04.000Z',
        status: 'Pendente',
        sellerName: 'Fulana Pereira',
        sellerEmail: 'fulana@deliveryapp.com',
        products: [
          {
            id: 1,
            name: 'Skol Lata 250ml',
            price: '2.20',
            quantity: 1,
          },
        ],
      });

      await act(async () => {
        renderWithRouter(<SellerDetails />, { route: 'seller/orders/1' });
        await waitFor(() => expect(requestData).toHaveBeenCalled());

        expect(window.location.pathname).toBe('/seller/orders/1');

        const dispatchBtn = screen
          .getByTestId('seller_order_details__button-dispatch-check');
        const preparingBtn = screen
          .getByTestId('seller_order_details__button-preparing-check');

        expect(dispatchBtn)
          .toBeDisabled();

        await userEvent
          .click(preparingBtn);

        expect(dispatchBtn)
          .toBeEnabled();

        await userEvent
          .click(dispatchBtn);

        expect(requestUpdate).toHaveBeenCalled();
      });
    },
  );
});
