import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CustomerProducts from '../../customers/pages/customerProducts';
import renderWithRouter from '../helpers/renderWithRouter';
import { requestData } from '../../utils/apiConnection';
import products from '../__mocks__/products';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Customer Products Page test', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  it('renders all products cards', async () => {
    const productCardsNumber = 11;
    requestData.mockResolvedValueOnce(products);
    await act(async () => {
      renderWithRouter(<CustomerProducts />, { route: '/customer/products' });

      await waitFor(() => expect(requestData).toHaveBeenCalled());
      const productCardsTitle = screen.getAllByTestId(/customer_products__element-card-title-/i);
      expect(productCardsTitle).toHaveLength(productCardsNumber);
      const productCardsPrice = screen.getAllByTestId(/customer_products__element-card-price-/i);
      expect(productCardsPrice).toHaveLength(productCardsNumber);
      const productCardsImage = screen.getAllByTestId(/customer_products__img-card-bg-image-/i);
      expect(productCardsImage).toHaveLength(productCardsNumber);
      const productCardsRMButton = screen.getAllByTestId(/customer_products__button-card-rm-item-/i);
      expect(productCardsRMButton).toHaveLength(productCardsNumber);
      const productCardsQuantity = screen.getAllByTestId(/customer_products__input-card-quantity-/i);
      expect(productCardsQuantity).toHaveLength(productCardsNumber);
      const productCardsADDButton = screen.getAllByTestId(/customer_products__button-card-add-item-/i);
      expect(productCardsADDButton).toHaveLength(productCardsNumber);
    });
  });
  it('should render the name and navBar', async () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
    requestData.mockResolvedValueOnce(products);

    await act(async () => {
      renderWithRouter(<CustomerProducts />, { route: 'customer/products' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const navBarElement = screen.getByRole('navigation');
      expect(navBarElement).toBeInTheDocument();

      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toHaveTextContent('Test User');

      expect(screen.getByTestId('customer_products__checkout-bottom-value'))
        .toHaveTextContent('0,00');
      expect(screen.getByTestId('customer_products__button-cart')).toBeDisabled();
    });
  });
  it(
    'should increase the totalPrice and change the path if click in the button',
    async () => {
      const navigate = jest.fn();
      useNavigate.mockReturnValue(navigate);
      requestData.mockResolvedValueOnce(products);
      await act(async () => {
        renderWithRouter(<CustomerProducts />, { route: '/customer/products' });

        await waitFor(() => expect(requestData).toHaveBeenCalled());

        await userEvent
          .click(screen.getByTestId('customer_products__button-card-add-item-1'));
        await userEvent.click(screen.getByTestId('customer_products__button-cart'));

        expect(screen.getByTestId('customer_products__checkout-bottom-value'))
          .toHaveTextContent('2,20');

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/customer/checkout'));
      });
    },
  );
});
