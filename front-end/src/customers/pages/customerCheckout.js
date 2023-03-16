import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/productTable';
import Navbar from '../components/navBar';
import { requestData, requestLogin } from '../../utils/apiConnection';

function CustomerCheckout() {
  const [name, setName] = useState('usuario');
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [sellers, setSellers] = useState([]);
  const [sellerId, setSellerId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    requestData('/sellers')
      .then((result) => {
        if (isMounted) {
          setSellers(result);
          setSellerId(result[0].id);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sellers]);

  function calculateTotalPrice(cart) {
    return cart.reduce(
      (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
      0,
    );
  }

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('cart')) || [];
    const cart = local.filter((element) => element.quantity > 0);
    setCartItems(cart);
    setTotalPrice(calculateTotalPrice(cart));

    const getName = JSON.parse(localStorage.getItem('user'));
    if (getName) {
      setName(getName.name);
    }
  }, []);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(cartItems));
  }, [cartItems]);

  function handleDeliveryAddressChange({ target }) {
    setDeliveryAddress(target.value);
  }

  function handleDeliveryNumberChange({ target }) {
    setDeliveryNumber(target.value);
  }

  function handleButton() {
    const order = cartItems
      .map((item) => ({ productId: item.id, quantity: item.quantity }));

    requestLogin('/sales', {
      sellerId,
      totalPrice,
      deliveryAddress,
      deliveryNumber,
      order,
    })
      .then((response) => {
        navigate(`/customer/orders/${response}`);
      });
  }

  return (
    <>
      <div>
        <Navbar name={ name } />
        {cartItems.map((item, index) => (
          <ProductTable
            product={ item }
            index={ index }
            key={ item.id }
            cart={ cartItems }
            setCart={ setCartItems }
          />
        ))}
        <div>
          <span>Total: R$</span>
          <span
            data-testid="customer_checkout__element-order-total-price"
          >
            {totalPrice.toFixed(2).replace('.', ',')}

          </span>
        </div>
      </div>
      <div>
        P. Vendedora Responsável:
        <select
          id="select-seller"
          name="select-seller"
          data-testid="customer_checkout__select-seller"
          onChange={ ({ target }) => setSellerId(Number(target.value)) }
        >
          {sellers.map((seller) => (
            <option
              key={ seller.id }
              value={ seller.id }
            >
              {seller.name}
            </option>
          ))}
        </select>

        Endereço
        <input
          data-testid="customer_checkout__input-address"
          onChange={ handleDeliveryAddressChange }
        />
        Número
        <input
          data-testid="customer_checkout__input-address-number"
          onChange={ handleDeliveryNumberChange }
        />
        <button
          type="button"
          data-testid="customer_checkout__button-submit-order"
          onClick={ handleButton }
        >
          FINALIZAR PEDIDO
        </button>
      </div>
    </>
  );
}

export default CustomerCheckout;
