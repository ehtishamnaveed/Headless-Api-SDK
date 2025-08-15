# Headless Woo API Library for Frontend
A special front end library for headless woocomerce via the use of ``Cocart API`` to negate the use of ``Node JS Server``.

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
