import React from 'react';
import {
  screen,
  // waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import axiosMock from 'axios';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../../App';

describe('Login screen tests:', () => {
  beforeEach(() => {
    localStorage.removeItem('user');
  });
  it('testing the Email and Password input elements', () => {
    // const { history } = renderWithRouter(<App />);
    // history.push('/login');

    renderWithRouter(<App />, { route: '/login' });
    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);

    expect(inputEmail).toBeInTheDocument();
    expect(inputPass).toBeInTheDocument();
  });

  it('Login and Registration buttons rendered', () => {
    renderWithRouter(<App />, { route: '/login' });

    const loginBtn = screen.getByTestId(/common_login__button-login/i);
    const registerBtn = screen.getByTestId(/common_login__button-register/i);

    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  it('Login button is disabled', () => {
    renderWithRouter(<App />, { route: '/login' });

    const inputEmail = screen.getByTestId(/common_login__input-email/i);
    const inputPass = screen.getByTestId(/common_login__input-password/i);
    const loginBtn = screen.getByTestId(/common_login__button-login/i);

    // expect(loginBtn).toBeDisabled();

    userEvent.type(inputEmail, 'leandrojamir@t');
    userEvent.type(inputPass, '1234');

    expect(loginBtn).toBeDisabled();
  });

  it('Teste hidden element', async () => {
    // // e dica para usar o navigate esta em
    // // http://pawelgoscicki.com/archives/2022/05/testing-usenavigate-navigate-from-react-router-v6/
    // // dica mentoria com Danilo, falta mockar conexão com backend
    // // https://www.webtips.dev/webtips/jest/mock-function-return-values
    // renderWithRouter(<App />, { route: '/login' });

    // const inputEmail = screen.getByTestId(/common_login__input-email/i);
    // const inputPass = screen.getByTestId(/common_login__input-password/i);
    // const loginBtn = screen.getByTestId(/common_login__button-login/i);

    // userEvent.type(inputEmail, { target: { value: 'zebirita@email.com' } });
    // userEvent.type(inputPass, { target: { value: '$#zebirita#$' } });
    // userEvent.click(loginBtn);
    // // await waitFor(() => userEvent.click(loginBtn));

    // // userEvent.type(inputEmail, 'fulana@deliveryapp.com');
    // // userEvent.type(inputPass, 'senhaErrada');
    // // userEvent.click(loginBtn);

    // // const hiddenElement = screen.getByTestId(/common_login__element-invalid-email/i);
    // await waitFor(() => {
    //   const hiddenElement = screen.getByTestId(/common_login__element-invalid-email/i);
    //   expect(hiddenElement).toBeInTheDocument();
    //   expect(hiddenElement).toContain(/Invalid/i);
    // });

    // // await waitFor(() => {
    // //   userEvent.click(loginBtn);
    // // });

    // // const senhaErrada = screen.getByText(/Invalid email or password/i);
    // // const senhaErrada = await screen.getByPlaceholderText(/Invalid email or password/i);
    // // await waitFor(() => {
    // //   expect(screen.getByText('Invalid email or password').toBeInTheDocument());
    // // });

    // // expect(hiddenElement).toBeInTheDocument();
    // // expect(hiddenElement).toHaveValue(/Invalid email or password/i);
    // // await expect(hiddenElement).toHaveValue('Invalid email or password');
    // // expect(senhaErrada).toBeInTheDocument();
    // // expect(senhaErrada.innerHTML).toBeInTheDocument();
    // // await waitFor(() => {
    // //   expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    // // });
  });
});

// Links passados na mentoria pelo Ivan
// https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/095ebb0d-1932-4d37-933b-9e1d721646fb/section/89bf51d9-0bcc-4c9f-86a5-c7ff5df910bc/day/b848cbc2-853c-441f-8e2e-52c5f2467a4b/lesson/64cfeb60-cd2e-41f9-9cf3-612d758a35bd
// https://www.youtube.com/watch?v=Ngj2f1n9pUw
