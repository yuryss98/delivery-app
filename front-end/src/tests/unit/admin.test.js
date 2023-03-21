import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import AdminManageUsers from '../../admin/pages/adminManageUsers';
import renderWithRouter from '../helpers/renderWithRouter';
import { requestData, requestDelete, requestLogin } from '../../utils/apiConnection';

jest.mock('../../utils/apiConnection', () => ({
  requestData: jest.fn(),
  requestLogin: jest.fn(),
  requestDelete: jest.fn(),
}));

const route = '/admin/manage';
const allUsers = [
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
];

describe('AdminManageUsers component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem('user');
  });

  it('should render all elements in the page', async () => {
    requestData.mockResolvedValueOnce(allUsers);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route });
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

    localStorage.setItem('user', JSON.stringify({ name: 'Miguel' }));
    requestLogin.mockResolvedValueOnce(user);
    requestData.mockResolvedValueOnce(allUsers);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route });
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
  it('test navBar user name', async () => {
    requestData.mockResolvedValueOnce([]);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route });
      await waitFor(() => expect(requestData).toHaveBeenCalled());

      expect(screen.getByTestId('customer_products__element-navbar-user-full-name'))
        .toHaveTextContent('usuario');
    });
  });
  it('Test if returns a error if try to register an existent user ', async () => {
    const errorMessage = 'User already exists';
    requestLogin.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route });

      const inputName = screen.getByTestId(/admin_manage__input-name/i);
      const inputEmail = screen.getByTestId(/admin_manage__input-email/i);
      const inputPass = screen.getByTestId(/admin_manage__input-password/i);
      const registerBtn = screen.getByTestId(/admin_manage__button-register/i);

      await userEvent.type(inputName, allUsers[0].name);
      await userEvent.type(inputEmail, allUsers[0].email);
      await userEvent.type(inputPass, 'fulana@123');
      await userEvent.click(registerBtn);
      expect(requestLogin).toHaveBeenCalledWith('/admin/register', {
        name: allUsers[0].name,
        email: allUsers[0].email,
        password: 'fulana@123',
        role: allUsers[0].role,
      });
      await waitFor(() => {
        expect(screen.getByTestId('admin_manage__element-invalid-register'))
          .toHaveTextContent('User already exists');
      });
    });
  });
  it('shoul call requestDelete function when a user is deleted', async () => {
    requestDelete.mockReturnValue(allUsers[0]);

    requestData.mockResolvedValueOnce(allUsers);

    await act(async () => {
      renderWithRouter(<AdminManageUsers />, { route });
      await waitFor(() => expect(requestData).toHaveBeenCalled());
      const allUSersName = screen.getAllByTestId(/admin_manage__element-user-table-name-/i);
      const allUSersEmail = screen.getAllByTestId(/admin_manage__element-user-table-email-/i);
      const allUSersRole = screen.getAllByTestId(/admin_manage__element-user-table-role-/i);
      const allUsersRemove = screen.getAllByTestId(/admin_manage__element-user-table-remove-/i);

      expect(allUSersName).toHaveLength(2);
      expect(allUSersEmail).toHaveLength(2);
      expect(allUSersRole).toHaveLength(2);
      expect(allUsersRemove).toHaveLength(2);

      await userEvent
        .click(allUsersRemove[0]);
      expect(requestDelete).toHaveBeenCalledWith('/admin/users/2');
    });
  });
});
