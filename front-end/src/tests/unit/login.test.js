import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import renderWithRouter from '../helpers/renderWithRouter';
import Login from '../../auth/login';
import { requestLogin } from '../../utils/apiConnection';

jest.mock('../../utils/apiConnection', () => ({
  requestLogin: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Page tests:', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    localStorage.removeItem('user');
  });
  it('Test the elements are rendered and if login button are disabled', () => {
    renderWithRouter(<Login />, { route: '/login' });

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByTestId(/common_login__input-email/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_login__input-password/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_login__button-login/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_login__button-login/i)).toBeDisabled();
    expect(screen.getByTestId(/common_login__button-register/i)).toBeInTheDocument();
    expect(screen.getByTestId('common_login__element-invalid-email'))
      .toBeInTheDocument();
  });
  it('Test if change path if click on register button', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    renderWithRouter(<Login />, { route: '/login' });

    expect(window.location.pathname).toBe('/login');
    await userEvent.click(screen.getByTestId(/common_login__button-register/i));

    expect(navigateMock).toHaveBeenCalledWith('/register');
  });
  it('Test if the button are disabled if one field is invalid', async () => {
    renderWithRouter(<Login />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);

    await userEvent.type(inputEmail, 'miguel@trybe.com');
    await userEvent.type(inputPass, '12');

    expect(screen.getByTestId(/common_login__button-login/i)).toBeDisabled();
  });
  it('Test Login with Invalid Email', async () => {
    const errorMessage = 'Invalid email or password';
    requestLogin.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
    renderWithRouter(<Login />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);
    const loginButton = screen.getByTestId(/common_login__button-login/i);

    await userEvent.type(inputEmail, 'miguelvieira@trybe.com');
    await userEvent.type(inputPass, '123456');
    await userEvent.click(loginButton);
    expect(requestLogin).toHaveBeenCalledWith('/login', {
      email: 'miguelvieira@trybe.com',
      password: '123456',
    });
    expect(screen.getByTestId('common_login__element-invalid-email'))
      .toHaveTextContent(errorMessage);
  });
  it('should navigate to "/seller/orders" for seller role', async () => {
    const navigateMock = jest.fn();
    const response = { role: 'seller' };
    requestLogin.mockResolvedValueOnce(response);
    useNavigate.mockReturnValue(navigateMock);

    renderWithRouter(<Login />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);
    const loginButton = screen.getByTestId(/common_login__button-login/i);

    await userEvent.type(inputEmail, 'fulana@deliveryapp.com');
    await userEvent.type(inputPass, 'fulana@123');
    await userEvent.click(loginButton);

    expect(localStorage.getItem('user')).toBe(JSON.stringify(response));
    expect(navigateMock).toHaveBeenCalledWith('/seller/orders');
  });
  it('should navigate to "/admin/manage" for administrator role', async () => {
    const navigateMock = jest.fn();
    const response = { role: 'administrator' };
    useNavigate.mockReturnValue(navigateMock);
    requestLogin.mockResolvedValueOnce(response);

    renderWithRouter(<Login />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);
    const loginButton = screen.getByTestId(/common_login__button-login/i);

    await userEvent.type(inputEmail, 'adm@deliveryapp.com');
    await userEvent.type(inputPass, '--adm2@21!!--');
    await userEvent.click(loginButton);

    expect(localStorage.getItem('user')).toBe(JSON.stringify(response));
    expect(navigateMock).toHaveBeenCalledWith('/admin/manage');
  });
  it('should navigate to "/customer/products" for any other role', async () => {
    const navigateMock = jest.fn();
    const response = { role: 'customer' };
    useNavigate.mockReturnValue(navigateMock);
    requestLogin.mockResolvedValueOnce(response);

    renderWithRouter(<Login />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);
    const loginButton = screen.getByTestId(/common_login__button-login/i);

    await userEvent.type(inputEmail, 'zebirita@email.com');
    await userEvent.type(inputPass, '$#zebirita#$');
    await userEvent.click(loginButton);

    expect(localStorage.getItem('user')).toBe(JSON.stringify(response));
    expect(navigateMock).toHaveBeenCalledWith('/customer/products');
  });
});
