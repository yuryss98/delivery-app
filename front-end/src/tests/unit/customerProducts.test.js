import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CustomerProducts from '../../customers/pages/customerProducts';
import renderWithRouter from '../helpers/renderWithRouter';
import { requestData } from '../../utils/apiConnection';
import products from '../__mocks__/products';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
}));

describe('Customer Products Page test', () => {
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
    requestData.mockResolvedValueOnce(products);
    await act(async () => {
      renderWithRouter(<CustomerProducts />, { route: 'customer/products' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const navBarElement = screen.getByRole('navigation');
      expect(navBarElement).toBeInTheDocument();

      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toHaveTextContent('usuario');
    });
  });
});
