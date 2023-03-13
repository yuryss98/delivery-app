import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../../App';

describe('Testing register screen', () => {
  it('Test the elements are rendered', () => {
    renderWithRouter(<App />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    expect(inputName).toBeInTheDocument();
    expect(inputEmail).toBeInTheDocument();
    expect(inputPass).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });
  it('Register button is disabled', () => {
    renderWithRouter(<App />, { route: '/register' });

    const inputName = screen.getByTestId(/common_register__input-name/i);
    const inputEmail = screen.getByTestId(/common_register__input-email/i);
    const inputPass = screen.getByTestId(/common_register__input-password/i);
    const registerBtn = screen.getByTestId(/common_register__button-register/i);

    // expect(loginBtn).toBeDisabled();

    userEvent.type(inputName, 'lean');
    userEvent.type(inputEmail, 'leandrojamir@t');
    userEvent.type(inputPass, '1234');

    expect(registerBtn).toBeDisabled();
  });
});
