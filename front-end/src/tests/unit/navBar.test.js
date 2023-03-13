import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../../App';

describe('Test navbar used on all pages', () => {
  it('Test the common inputs', () => {
    renderWithRouter(<App />, { route: '/customer/products' });

    const productsBtn = screen.getByTestId(/customer_products__element-navbar-link-products/i);
    const ordesBtn = screen.getByTestId(/customer_products__element-navbar-link-orders/i);
    const nameBtn = screen.getByTestId(/customer_products__element-navbar-user-full-name/i);
    const logoutBtn = screen.getByTestId(/customer_products__element-navbar-link-logout/i);

    expect(productsBtn).toBeInTheDocument();
    expect(ordesBtn).toBeInTheDocument();
    expect(nameBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });

  it('test the specific titles for admin', () => {
    renderWithRouter(<App />, { route: '/admin/manage' });

    const ordesBtn = screen.getByTestId(/customer_products__element-navbar-link-orders/i);
    const gerenciarUsuarios = screen.getByText('GERENCIAR USUÁRIOS');

    expect(ordesBtn).toBeInTheDocument();
    expect(gerenciarUsuarios).toBeInTheDocument();
  });
});

// Para testar as linhas abaixo preciso entrar na mentoria e descobrir quem é o substitudo do history.push e expect {pathname} na versão 6 do router-dom
// const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const handleProductsClick = () => {
//     if (currentRoute) {
//       navigate('/customer/products');
//     } else {
//       navigate('/seller/order');
//     }
//   };

//   const handleOrdersClick = () => {
//     if (currentRoute) {
//       navigate('/customer/orders');
//     } else {
//       navigate('/seller/orders');
//     }
//   };
