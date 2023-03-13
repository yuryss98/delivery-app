// // https://testing-library.com/docs/example-react-router/
// // import * as router from 'react-router';
// import React from 'react';
// import {
//   screen,
//   waitFor,
// } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// // import axios from 'axios';
// import renderWithRouter from '../helpers/renderWithRouter';
// import App from '../../App';

// jest.mock('axios');

describe('Login screen tests:', () => {
  // dica mentoria com Danilo, dois problemas, falta mockar conexão com backend e depois posso usar direto o navigate com useNavigate atraves do jest
  // http://pawelgoscicki.com/archives/2022/05/testing-usenavigate-navigate-from-react-router-v6/
  // const navigate = jest.fn();
  // beforeEach(() => {
  //   jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  // });
  // jest.mock('axios');

  it('Checks if the route is correct (/login)', async () => {
    // renderWithRouter(<App />, { route: '/login' });

    // const inputEmail = screen.getByTestId('common_login__input-email');
    // const inputPass = screen.getByTestId('common_login__input-password');
    // const loginBtn = screen.getByTestId('common_login__button-login');

    // userEvent.type(inputEmail, 'fulana@deliveryapp.com');
    // userEvent.type(inputPass, 'fulana@123');
    // userEvent.click(loginBtn);

    // // expect(navigate).toHaveBeenCalledWith('/seller/orders');
    // // await waitFor(() => {
    // //   expect(navigate).toHaveBeenCalledWith('/seller/orders');
    // // });

    // // dica do Ivan na mentoria ao Miguel foi diferente ao inves de jest e navigate usar usar window.location.pathname
    // // expect(window.location.pathname).toHaveBeenCalledWith('/seller/orders');
    // await waitFor(() => {
    //   expect(window.location.pathname).toBe('/seller/orders');
    // });
  });
});
