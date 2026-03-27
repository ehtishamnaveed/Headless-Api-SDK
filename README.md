# Headless Woo API Library for Frontend

A lightweight JavaScript/TypeScript library for building headless WooCommerce storefronts using the [CoCart API](https://cocartapi.com/).

> **Note:** Currently supports guest customers only.

---

## Installation

```bash
npm install git+https://github.com/ehtishamnaveed/Headless-Api-SDK.git
```

---

## Setup

Import and initialize the client with your WordPress site URL:

```javascript
import createApiClient from "@Ehtisham/headless-api-sdk";

const api = createApiClient("https://your-site-url.com");
```

> **Recommended:** Store your URL in a `.env` file instead of hardcoding it.
>
> ```env
> VITE_API_BASE_URL=https://your-site-url.com
> ```
>
> ```javascript
> const api = createApiClient(import.meta.env.VITE_API_BASE_URL);
> ```

All functions are `async` — always use `await` when calling them.

> The cart key is managed automatically in `localStorage`. You do not need to pass it to any function.

---

## Functions

### `getProducts()`

Returns the full list of products.

```javascript
const products = await api.getProducts();
console.log(products);
```

---

### `getCart()`

Returns the current cart contents using the cart key stored in `localStorage`.

```javascript
const cart = await api.getCart();
console.log(cart);
```

---

### `addToCart(id, quantity?)`

Adds a product to the cart. If no cart exists yet, one is created automatically and its key is saved to `localStorage`.

| Parameter  | Type   | Required | Default |
|------------|--------|----------|---------|
| `id`       | string | Yes      |         |
| `quantity` | string | No       | `"1"`   |

```javascript
await api.addToCart("101");       // adds 1
await api.addToCart("101", "3"); // adds 3
```

---

### `updateItem(item_key, quantity)`

Updates the quantity of an item already in the cart.

| Parameter  | Type   | Required |
|------------|--------|----------|
| `item_key` | string | Yes      |
| `quantity` | string | Yes      |

```javascript
const cart = await api.updateItem("item5678", "3");
console.log(cart);
```

---

### `removeItem(item_key)`

Removes an item from the cart.

| Parameter  | Type   | Required |
|------------|--------|----------|
| `item_key` | string | Yes      |

```javascript
const cart = await api.removeItem("item5678");
console.log(cart);
```
