import axios from "axios";

export default function createApiClient(siteURL: string) {
	const baseURL = `${siteURL}/wp-json/cocart/v2`;
	const API= axios.create({
		baseURL,
		headers: { 'Accept': 'application/json' }
	});

// --------------------------------------------------------------------------------//
// Helper functions

	// Get cart_key from the local Storage
	const getCartKey = (): string => {
		return localStorage.getItem("cart_key") || "";
	}

	// Set cart_key in the local Storage
	const setCartKey = (cartName: string, cartValue: string) => {
		localStorage.setItem(cartName,cartValue);
	}

	// Format cart data for ``sidebar``
	const formatCartData = (response: any) => {
	  const minor_unit = response.currency.currency_minor_unit;
	  const total_amount = response.totals.total/ Math.pow(10, minor_unit);

	  return{
	    total_amount,
	    total_items: response.item_count,
	    currency_symbol: response.currency.currency_symbol,
	    cart_items: response.items
	  };
	};

	// Format product data
	const formatProductsData = (response: any) => {
	  return response.data.products.map((product: any) => ({
	      id: String(product.id),
	      name: product.name,
	      slug: product.slug,
	      summary: product.short_description,
	      description: product.long_description,
	      // minor_unit: product.prices.currency.currency_minor_unit,
	      regular_price: product.prices.regular_price/Math.pow(10,2),
	      sale_price: product.prices.sale_price/Math.pow(10,2),
	      sale_duration: {
	        start: product.prices.date_on_sale.from,
	        end: product.prices.date_on_sale.to
	      },

	      featured_image: {
	        name: product.images[0].name,
	        path: product.images[0].src.full,
	      },

	      gallery: product.images.slice(1).map((img: any) => ({
	        name: img.name,
	        path: img.src.full,
	      })),

	      categories: product.categories.map((category: any) => ({
	        id: String(category.id),
	        name: category.name,
	        slug: category.slug,
	      })),

	      variations: product.variations.map((variation: any) => ({
	        id: String(variation.id),
	        name: variation.attributes.attribute_format,
	        description: variation.description,
	        image: variation.featured_image.full,
	        regular_price: variation.prices.regular_price/Math.pow(10,2),
	        sale_price: variation.prices.sale_price/Math.pow(10,2),
	        sale_duration: {
	          start: variation.prices.date_on_sale.from,
	          end: variation.prices.date_on_sale.to,
	        },
	      })),

	      stock: {
	        status: product.stock.stock_status,
	        quantity: product.stock.stock_quantity,
	      },

	      weight: product.weight,
	      dimension: product.dimensions,
	      related_products: product.related.map((related_product: any) => ({
	        id: String(related_product.id),
	      })),

	    }));
	}

// --------------------------------------------------------------------------------//
// Headless functions

	return {
		//Get products
		async getProducts() {
			console.log('Fetching the products.');
	        try {
	        	const response = await API.get(`/products`);
	        	console.log('Products fetched successfully');
	        	return formatProductsData(response);
	        } catch (error: any) {
			    const message = error.response?.data?.message || error.message || "Failed to fetch cart.";
			    return { success: false, error: message, };
			  }
		},

		// Get cart
		async getCart() {
	        try {
	        	const cart_key = getCartKey();
	        	// Ensure cart_key is provided as `string` and is not empty
	        	if (typeof cart_key !== "string") throw new Error("cart_key is required as `string`.");
	        	if (cart_key === "") throw new Error("No Cart is present.");

		        console.log('Fetching the cart.');

	        	const response = await API.get(`/cart`,
	        	{
	        		params: {
	        			cart_key: cart_key
	        		},
	        	});
	        	console.log('Cart fetched successfully');
	        	return formatCartData(response.data);
	        } catch (error: any) {
			    const message = error.response?.data?.message || error.message || "Failed to fetch cart.";
			    return { success: false, error: message, };
			  }
		},

		// Add to cart
		async addToCart(id: string, quantity: string = "1") {
		    try {
		    	const cart_key = getCartKey();
		    	// Ensure cart_key is provided as `string`
		    	if (typeof cart_key !== "string") throw new Error("cart_key is required as `string`.");

	        	// Ensure id is provided as `string` and is not empty
	        	if (typeof id !== "string") throw new Error(" id is required as `string`.");
		    	if (id === "") throw new Error("id is required, can't be empty.");

		    	// Ensure quantity is provided as `string`
		    	if (typeof quantity !== "string") throw new Error("quantity is required as a `string`")


		    	// Notifier to show information about `New` and `Exisitng cart`
		    	if (cart_key === "") {
		            console.log('🛒 Creating new cart with item...');
		        }
		        else{
		            console.log(`Current 🛒 cart_key: ${cart_key}`);
		            console.log('🛒Adding item to existing cart...');
		        }

			    const response = await API.post(`/cart/add-item`,
			      { // Pass as json data body
			        id: id,
			        quantity: quantity
			      }, 
			      { // Pass parameter
			        params: {
			          cart_key: cart_key
			        },
			      });
			    // res.cookie('cart_key', response.data.cart_key, { httpOnly: true });
			    console.log("Item added");
			    console.log("Key Stored");
			    // localStorage.setItem(cart_key,response.data.cart_key);
			    setCartKey("cart_key", response.data.cart_key);
			    // return response.data.cart_key;

			} catch (error: any) {
			    const message = error.response?.data?.message || error.message || "Failed to fetch cart.";
			    return { success: false, error: message, };
			  }
		},

		// Update item
		async updateItem(item_key: string, quantity: string) {
			try {
				const cart_key = getCartKey();
				// Ensure cart_key is provided as `string` and is not empty
				if (typeof cart_key !== "string") throw new Error("cart_key is required as `string`.");
				if (cart_key === "") throw new Error("No cart is present.");

				// Ensure item_key is provided as `string` and is not empty
				if (typeof item_key !== "string") throw new Error("item_key is required as `string`.");
				if (item_key === "") throw new Error("Item key is required");

				// Ensure quantity is provided as `string` and is not empty
				if (typeof quantity !== "string") throw new Error("quantity is required as `string`.");
				if (quantity === "") throw new Error("Quantity is required");

				const response = await API.post(`/cart/item/${item_key}`,
				{
			       quantity: quantity,
			    },
			    {
			    	params: {
			    		cart_key: cart_key,
			    	},
			    });
			    console.log("Item data updated.")
			    return response.data;
			} catch (error: any) {
			    const message = error.response?.data?.message || error.message || "Failed to fetch cart.";
			    return { success: false, error: message, };
			  }
		},

		// Remove item
		async removeItem(item_key: string) {
			try {
				const cart_key = getCartKey();
				// Ensure cart_key is provided as `string` and is not empty
				if (typeof cart_key !== "string") throw new Error("cart_key is required as `string`.");
				if (cart_key === "") throw new Error("No cart is present.");

				// Ensure item_key is provided as `string` and is not empty
				if (typeof item_key !== "string") throw new Error("item_key is required as `string`.");
				if (item_key === "") throw new Error("Item key is required");

				const response = await API.delete(`/cart/item/${item_key}`,
			    {
			    	params: {
			    		cart_key: cart_key,
			    	},
			    });
			    console.log("Item removed.")
			    return response.data;
			} catch (error: any) {
			    const message = error.response?.data?.message || error.message || "Failed to fetch cart.";
			    return { success: false, error: message, };
			  }
		}
	};
}