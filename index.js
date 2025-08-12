import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default function createApiClient(baseURL) {
	const API= axios.create({
		// baseURL: `${process.env.API_BASE_URL}${process.env.API_END_POINT_URL}`,
		baseURL,
		headers: { 'Accept': 'application/json' }
	});

	// Format cart data for ``sidebar``
	const formatCartData = (response) => {
	  const minor_unit = response.currency.currency_minor_unit;
	  const total_amount = response.totals.total/ Math.pow(10, minor_unit);

	  return{
	    total_amount,
	    total_items: response.item_count,
	    currency_symbol: response.currency.currency_symbol,
	    cart_items: response.items
	  };
	};

	return {
		// Get cart
		async getCart(cart_key) {
			if (!cart_key) {
	            throw new Error("Cart key is required");
	            return 0;
	        }
	        console.log('Fetching the cart.');
	        try {
	        	const response = await API.get(`/cart`,
	        	{
	        		params: {
	        			cart_key: cart_key
	        		},
	        	});
	        	console.log('Cart fetched successfully');
	        	return formatCartData(response.data);
	        } catch (error) {
			    console.error("❌ Error fetching cart:", error.response?.data || error.message);
			    throw new Error('Failed to fetch cart.');
			  }
		},

		// Add to cart
		async addToCart(cart_key = null, id, quantity = "1") {
			if (!cart_key) {
	            console.log('🛒 Creating new cart with item...');
	        }
	        else{
	            console.log(`Current 🛒 cart_key: ${cart_key}`);
	            console.log('🛒Adding item to existing cart...');
	        }
		    try {
			    const response = await API.post(`/cart/add-item`,
			      { // Pass as json data body
			        id: id,
			        quantity: quantity
			      }, 
			      { // Pass parameter
			        params: {
			          cart_key: cart_key
			        },
			        headers: {
			          'Content-Type': 'application/json',
			          'Accept': 'application/json',
			        },
			      });
			    console.log("Item added");
			    return response.data;
			} catch (error) {
			    console.error("❌ Error adding item:", error.response?.data || error.message);
			    throw new Error('Failed to add item in cart.');
			   }
		},

		// Update item
		async updateItem(cart_key, item_key, quantity) {
			if (!cart_key) {
				throw new Error("Cart key is required");
			}
			if (!item_key) {
				throw new Error("Item key is required");
			}
			if (!quantity) {
				throw new Error("Quantity is required");
			}

			try {
				const response = await API.post(`/cart/item/${item_key}`,
				{
			       quantity: quantity,
			    },
			    {
			    	params: {
			    		cart_key: cart_key,
			    	},
			    	headers: { 'Content-Type': 'application/json' }
			    });
			    console.log("Item data updated.")
			    return response.data;
			} catch (error) {
			    console.error("❌ Error updating item:", error.response?.data || error.message);
			    throw new Error('Failed to update item in cart.');
			   }
		},

		// Remove item
		async removeItem(cart_key, item_key) {
			if (!cart_key) {
				throw new Error("Cart key is required");
			}
			if (!item_key) {
				throw new Error("Item key is required");
			}

			try {
				const response = await API.delete(`/cart/item/${item_key}`,
			    {
			    	params: {
			    		cart_key: cart_key,
			    	},
			    });
			    console.log("Item removed.")
			    return response.data;
			} catch (error) {
			    console.error("❌ Error removing item:", error.response?.data || error.message);
			    throw new Error('Failed to remove item in cart.');
			   }
		}
	};
}