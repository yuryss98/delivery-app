import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import renderWithRouter from '../helpers/renderWithRouter';
import Register from '../../auth/register';
import { requestLogin } from '../../utils/apiConnection';

jest.mock('../../utils/apiConnection', () => ({
  requestLogin: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Testing Register Page', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Test if the elements are rendered and if register button are disabled', () => {
    renderWithRouter(<Register />, { route: '/register' });

    expect(window.location.pathname).toBe('/register');
    expect(screen.getByTestId(/common_register__input-name/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_register__input-email/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_register__input-password/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_register__button-register/i)).toBeInTheDocument();
    expect(screen.getByTestId(/common_register__button-register/i)).toBeDisabled();
    expect(screen.getByTestId('common_register__element-invalid_register'))
      .toBeInTheDocument();
  });
  it('Test if the button still disabled if one field are invalid', async () => {
    renderWithRouter(<Register />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    await userEvent.type(inputName, 'Yury');
    await userEvent.type(inputEmail, 'yury@trybe.com');
    await userEvent.type(inputPass, '123456');

    expect(registerBtn).toBeDisabled();

    await userEvent.type(inputName, 'Leandro Silva');
    await userEvent.type(inputEmail, 'leandro@t');
    await userEvent.type(inputPass, '123456');

    expect(registerBtn).toBeDisabled();

    await userEvent.type(inputName, 'Mayara Marques');
    await userEvent.type(inputEmail, 'mayara_marques@trybe.com');
    await userEvent.type(inputPass, '123');

    expect(registerBtn).toBeDisabled();
  });
  it('Test if the button are valid if all fields are valid', async () => {
    renderWithRouter(<Register />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    await userEvent.type(inputName, 'Leandro Silva');
    await userEvent.type(inputEmail, 'leandro@trybe.com');
    await userEvent.type(inputPass, '123456');

    expect(registerBtn).toBeEnabled();
  });
  it('Test if returns a error if try to register an existent user ', async () => {
    const errorMessage = 'User already exists';
    requestLogin.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

    renderWithRouter(<Register />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    await userEvent.type(inputName, 'Cliente Zé Birita');
    await userEvent.type(inputEmail, 'zebirita@email.com');
    await userEvent.type(inputPass, '$#zebirita#$');
    await userEvent.click(registerBtn);
    expect(requestLogin).toHaveBeenCalledWith('/register', {
      name: 'Cliente Zé Birita',
      email: 'zebirita@email.com',
      password: '$#zebirita#$',
    });
    await waitFor(() => {
      expect(screen.getByTestId('common_register__element-invalid_register'))
        .toHaveTextContent('User already exists');
    });
  });
  it('Test if its possible to register a new user ', async () => {
    const navigateMock = jest.fn();
    const user = {
      name: 'Miguel Vieira',
      email: 'miguel_vieira@trybe.com',
      password: '123456',
    };
    useNavigate.mockReturnValue(navigateMock);
    requestLogin.mockResolvedValueOnce(user);

    renderWithRouter(<Register />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    await userEvent.type(inputName, 'Miguel Vieira');
    await userEvent.type(inputEmail, 'miguel_vieira@trybe.com');
    await userEvent.type(inputPass, '123456');
    await userEvent.click(registerBtn);

    expect(requestLogin).toHaveBeenCalledWith('/register', user);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    expect(navigateMock).toHaveBeenCalledWith('/customer/products');
  });
});
