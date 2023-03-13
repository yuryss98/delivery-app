import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import Register from '../../auth/register';
// import { requestLogin } from '../../utils/apiConnection';
// import { useNavigate } from 'react-router-dom';

jest.mock('../../utils/apiConnection');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Register Screen Page Tests:', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all the input elements', () => {
    renderWithRouter(<Register />, { route: '/register' });

    expect(screen.getByTestId('common_register__input-name')).toBeInTheDocument();
    expect(screen.getByTestId('common_register__input-email')).toBeInTheDocument();
    expect(screen.getByTestId('common_register__input-password')).toBeInTheDocument();
    expect(screen.getByTestId('common_register__button-register')).toBeInTheDocument();
  });

  it('should disable the register button when input values are not valid', async () => {
    renderWithRouter(<Register />, { route: '/register' });

    const inputName = screen.getByTestId('common_register__input-name');
    const inputEmail = screen.getByTestId('common_register__input-email');
    const inputPassword = screen.getByTestId('common_register__input-password');
    const registerBtn = screen.getByTestId('common_register__button-register');

    expect(registerBtn).toBeDisabled();

    userEvent.type(inputName, 'invalid');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputEmail, 'invalid');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputPassword, 'invalid');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputName, 'Miguel Vieira');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputEmail, 'miguel@try');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputPassword, '123456');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputName, 'Mayara Marques');
    userEvent.type(inputEmail, 'mayara@trybe.com');
    userEvent.type(inputPassword, '12');
    expect(registerBtn).toBeDisabled();

    userEvent.type(inputName, 'Yury');
    userEvent.type(inputEmail, 'yury@trybe.com');
    userEvent.type(inputPassword, '123456');
    expect(registerBtn).not.toBeDisabled();
  });
});
