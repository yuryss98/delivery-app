// https://testing-library.com/docs/example-react-router/
import * as router from 'react-router';
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../../App';

describe('Login screen tests:', () => {
  const navigate = jest.fn();
  // dica mentoria com DEFAULT_INTERCEPT_RESOLUTION_PRIORITY, dois problemas, falta mockar conexão com backend e depois posso usar direto o navigate com useNavigate atraves do jest
  // http://pawelgoscicki.com/archives/2022/05/testing-usenavigate-navigate-from-react-router-v6/
  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });

  it('Checks if the route is correct (/login)', () => {
    // const { history } = renderWithRouter(<App />);
    // history.push('/login');

    const aaaaa = renderWithRouter(<App />, { route: '/login' });
    console.log(aaaaa);

    const inputEmail = screen.getByTestId('common_login__input-email');
    const inputPass = screen.getByTestId('common_login__input-password');
    const loginBtn = screen.getByTestId('common_login__button-login');

    userEvent.type(inputEmail, 'fulana@deliveryapp.com');
    userEvent.type(inputPass, 'fulana@123');
    userEvent.click(loginBtn);

    // await waitFor {
    //   expect(navigate).toHaveBeenCalledWith('/seller/orders');
    // }

    // userEvent.click(buttonEnter);
    // const { location: { pathname } } = history;
    // expect(pathname).toBe('/foods');
  });
});
