import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../../App';

describe('Login screen tests:', () => {
  // todos data-testid do login
  const inputEmailDtid = 'common_login__input-email';
  const inputPassDtid = 'common_login__input-password';
  const loginBtnDtid = 'common_login__button-login';
  const registerBtnDtid = 'common_login__button-register';
  const hiddenElementDtid = 'common_login__element-invalid-email';

  it('testing the Email and Password input elements', () => {
    // const { history } = renderWithRouter(<App />);
    // history.push('/login');

    renderWithRouter(<App />, { route: '/login' });
    const inputEmail = screen.getByTestId(inputEmailDtid);
    const inputPass = screen.getByTestId(inputPassDtid);

    expect(inputEmail).toBeInTheDocument();
    expect(inputPass).toBeInTheDocument();
  });

  it('Login and Registration buttons rendered', () => {
    renderWithRouter(<App />, { route: '/login' });

    const loginBtn = screen.getByTestId(loginBtnDtid);
    const registerBtn = screen.getByTestId(registerBtnDtid);

    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  it('Login button is disabled', () => {
    renderWithRouter(<App />, { route: '/login' });

    const inputEmail = screen.getByTestId(inputEmailDtid);
    const inputPass = screen.getByTestId(inputPassDtid);
    const loginBtn = screen.getByTestId(loginBtnDtid);

    // expect(loginBtn).toBeDisabled();

    userEvent.type(inputEmail, 'leandrojamir@t');
    userEvent.type(inputPass, '1234');

    expect(loginBtn).toBeDisabled();
  });

  it('Teste hidden element', async () => {
    renderWithRouter(<App />, { route: '/login' });

    const inputEmail = screen.getByTestId(inputEmailDtid);
    const inputPass = screen.getByTestId(inputPassDtid);
    const loginBtn = screen.getByTestId(loginBtnDtid);
    const hiddenElement = screen.getByTestId(hiddenElementDtid);

    userEvent.type(inputEmail, 'fulana@deliveryapp.com');
    userEvent.type(inputPass, 'senhaErrada');
    userEvent.click(loginBtn);

    // await waitFor(() => {
    //   userEvent.click(loginBtn);
    // });

    // const senhaErrada = screen.getByText(/Invalid email or password/i);
    // const senhaErrada = await screen.getByPlaceholderText(/Invalid email or password/i);
    await waitFor(() => {
      const senhaErrada = screen.getByText(/Invalid email or password/i);
      expect(senhaErrada).toBeInTheDocument();
    });

    expect(hiddenElement).toBeInTheDocument();
    // expect(hiddenElement).toHaveValue(/Invalid email or password/i);
    // await expect(hiddenElement).toHaveValue('Invalid email or password');
    // expect(senhaErrada).toBeInTheDocument();
    // expect(senhaErrada.innerHTML).toBeInTheDocument();
    // await waitFor(() => {
    //   expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    // });
  });
});

// Para testar as linhas abaixo preciso entrar na mentoria e descobrir quem é o substitudo do history.push e expect {pathname} na versão 6 do router-dom
// onClick={ () => navigate('/register') }
