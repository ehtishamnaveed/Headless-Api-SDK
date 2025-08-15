# Headless Woo API Library for Frontend
A special front end library for headless woocomerce via the use of ``Cocart API`` to negate the use of ``Node JS Server``.

`!! CURRENTLY FOR GUEST CUSTOMER USE ONLY`

## How to use it?
First use this command to install the library
```bash
npm install git+https://github.com/ehtishamnaveed/Headless-Api-SDK.git
```

In your main file add the following import at the top of your main file
```javascript 
import createApiClient from "@Ehtisham/headless-api-sdk";
```

Prepare the library to use your wordpress via adding ``https://your-site-URL.com`` inside
```javascript 
const api = createApiClient(Your-Site-URL)
```

### NOTE: Keep your website ``URL`` in your ``.env`` file and use its variable.
like:
```javascript 
const api = createApiClient(`${import.meta.env.VITE_API_BASE_URL}`);
```

Now can the functions as you like, but remmber to use ``await`` as they are ``async`` functions.

## Functions

### `getProducts()`
Returns the product list in **JSON** format.

**Example:**
```javascript
const products = await getProducts();
console.log(products);
```

### `getCart(cart_key)`
 returns the cart detail for a given `cart_key`
 
 **Parameters:**
- `cart_key` *(string, required)* — The unique cart identifier.

**Example:**
```javascript
const cart = await getCart("abcd1234");
console.log(cart);
```


### `addToCart(cart_key, id, quantity)`
 Adds an item to the cart.
 
 **Parameters:**
- `cart_key (string, optional)` — The existing cart key. If omitted, a new cart will be created and its key returned.
- `id (number|string, required)` — The product ID to add.
- `quantity (string, optional, default: "1")`  — Quantity to add.

**Example:**
```javascript
const cart = await addToCart(null, 101, 2); // Creates a new cart and adds item
const updatedCart = await addToCart("abcd1234", 101, 2); // Adds to existing cart
```


### `updateItem(cart_key, item_key, quantity)`
 Updates the quantity of a specific cart item.
 
 **Parameters:**
- `cart_key (string, required)` — The cart key.
- `item_key (string, required)` — The cart item key.
- `quantity (string, required)`  — The new quantity.

**Example:**
```javascript
const updatedCart = await updateItem("abcd1234", "item5678", 3);
console.log(updatedCart);
```


### `removeItem(cart_key, item_key)`
 Removes an item from the cart.
 
 **Parameters:**
- `cart_key (string, required)` — The cart key.
- `item_key (string, required)` — The cart item key.

**Example:**
```javascript
const updatedCart = await removeItem("abcd1234", "item5678");
console.log(updatedCart);
```

