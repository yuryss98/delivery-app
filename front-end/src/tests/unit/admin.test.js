import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import AdminManageUsers from '../../admin/pages/adminManageUsers';
import renderWithRouter from '../helpers/renderWithRouter';
import { requestData, requestLogin } from '../../utils/apiConnection';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
  requestLogin: jest.fn(),
}));

describe('AdminManageUsers component', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should render all elements in the page', async () => {
    requestData.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Fulana Pereira',
        role: 'seller',
        email: 'fulana@deliveryapp.com',
      },
      {
        id: 3,
        name: 'Cliente Zé Birita',
        role: 'customer',
        email: 'zebirita@email.com',
      },
    ]);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route: '/admin/manage' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      const allUSersName = screen.getAllByTestId(/admin_manage__element-user-table-name-/i);
      const allUSersEmail = screen.getAllByTestId(/admin_manage__element-user-table-email-/i);
      const allUSersRole = screen.getAllByTestId(/admin_manage__element-user-table-role-/i);
      const allUsersRemove = screen.getAllByTestId(/admin_manage__element-user-table-remove-/i);

      expect(screen.getByTestId('customer_products__element-navbar-link-orders'))
        .toBeInTheDocument();
      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toBeInTheDocument();
      expect(screen.getByTestId('customer_products__element-navbar-link-logout'))
        .toBeInTheDocument();

      expect(screen.getByTestId('admin_manage__input-name'))
        .toBeInTheDocument();
      expect(screen.getByTestId('admin_manage__input-email'))
        .toBeInTheDocument();
      expect(screen.getByTestId('admin_manage__input-password'))
        .toBeInTheDocument();
      expect(screen.getByTestId('admin_manage__select-role'))
        .toBeInTheDocument();
      expect(screen.getByTestId('admin_manage__button-register'))
        .toBeDisabled();

      expect(allUSersName).toHaveLength(2);
      expect(allUSersEmail).toHaveLength(2);
      expect(allUSersRole).toHaveLength(2);
      expect(allUsersRemove).toHaveLength(2);
    });
  });
  it('should add another user', async () => {
    const user = {
      name: 'Miguel Vieira',
      role: 'customer',
      email: 'miguel@trybe.com',
      password: '123456',
    };

    requestLogin.mockResolvedValueOnce(user);
    requestData.mockResolvedValueOnce([
      {
        id: 2,
        name: 'Fulana Pereira',
        role: 'seller',
        email: 'fulana@deliveryapp.com',
      },
      {
        id: 3,
        name: 'Cliente Zé Birita',
        role: 'customer',
        email: 'zebirita@email.com',
      },
    ]);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route: '/admin/manage' });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      await userEvent
        .type(screen.getByTestId('admin_manage__input-name'), 'Miguel Vieira');

      await userEvent
        .type(screen.getByTestId('admin_manage__input-email'), 'miguel@trybe.com');

      await userEvent
        .type(screen.getByTestId('admin_manage__input-password'), '123456');

      await userEvent
        .selectOptions(screen.getByTestId('admin_manage__select-role'), 'customer');

      await userEvent.click(screen.getByTestId('admin_manage__button-register'));

      expect(requestLogin).toHaveBeenCalledWith('/admin/register', user);
    });
  });
});
