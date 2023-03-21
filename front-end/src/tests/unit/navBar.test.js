import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import renderWithRouter from '../helpers/renderWithRouter';
import AdminManageUsers from '../../admin/pages/adminManageUsers';
import CustomerProducts from '../../customers/pages/customerProducts';
import CustomerCheckout from '../../customers/pages/customerCheckout';
import { requestData } from '../../utils/apiConnection';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Test navbar used on all pages', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('test the specific titles for admin', async () => {
    requestData.mockResolvedValue([]);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route: '/admin/manage' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const ordesBtn = screen.getByTestId(/customer_products__element-navbar-link-orders/i);
      const gerenciarUsuarios = screen.getByText('GERENCIAR USUÁRIOS');

      expect(ordesBtn).toBeInTheDocument();
      expect(gerenciarUsuarios).toBeInTheDocument();
    });
  });

  it('logs out when the "Sair" button is clicked', async () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Miguel' }));
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    await act(async () => {
      renderWithRouter(<CustomerProducts />, { route: 'customer/products' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const logoutButton = screen
        .getByTestId('customer_products__element-navbar-link-logout');

      await userEvent.click(logoutButton);
      expect(localStorage.getItem('user')).toBe(null);
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  it('navigates to the products page when the "PRODUTOS" button is clicked', async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    requestData.mockResolvedValue([]);

    await act(async () => {
      renderWithRouter(<CustomerCheckout />, { route: 'customer/checkout' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const productsButton = screen
        .getByTestId('customer_products__element-navbar-link-products');

      await userEvent.click(productsButton);
      expect(navigate).toHaveBeenCalledWith('/customer/products');
    });
  });
});
