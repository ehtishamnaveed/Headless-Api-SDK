import axios from "axios";

export default function createApiClient(siteURL) {
	const baseURL = `${siteURL}/wp-json/wp/v2`;
	const API= axios.create({
		baseURL,
		headers: { 'Accept': 'application/json' }
	});

// --------------------------------------------------------------------------------//
// Helper functions

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

	// Format product data
	const formatProductsData = async (response) => {
		return response.data.products.map(product => ({
	      id: product.id,
	      name: product.name,
	      slug: product.slug,
	      summary: product.short_description,
	      description: product.long_description,
	      regular_price: product.prices.regular_price,
	      sale_price: product.prices.sale_price,
	      sale_duration: {
	        start: product.prices.date_on_sale.from,
	        end: product.prices.date_on_sale.to
	      },
	      featured_image: {
	        name: product.images[0].name,
	        path: product.images[0].src.full,
	      },
	      gallery: product.images.slice(1).map(img => ({
	        name: img.name,
	        path: img.src.full
	      })),
	      categories: product.categories.map(category => ({
	        id: category.id,
	        name: category.name,
	        slug: category.slug,
	      })),
	      variations: product.variations,
	      stock: {
	        status: product.stock.stock_status,
	        quantity: product.stock.stock_quantity,
	      },
	      weight: product.weight,
	      dimension: product.dimensions,
	      related_products: product.related.map(related_product => ({
	        id: related_product.id,
	      })),
	    })
	  );
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
	        	return formatProductsData(response.data);
	        } catch (error) {
			    console.error("❌ Error fetching products:", error.response?.data || error.message);
			  }
		},

		// Get cart
		async getCart(cart_key: string) {
	        try {
	        	if (cart_key === "") {
		            throw new Error("Cart key is required");
		        }
		        console.log('Fetching the cart.');

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
			  }
		},

		// Add to cart
		async addToCart(cart_key: string = "", id: string, quantity: string = "1") {
			if (cart_key === "") {
	            console.log('🛒 Creating new cart with item...');
	        }
	        else{
	            console.log(`Current 🛒 cart_key: ${cart_key}`);
	            console.log('🛒Adding item to existing cart...');
	        }
		    try {
		    	if (id === "") throw new Error("Product id not found.");

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
			    return response.data.cart_key;

			} catch (error) {
			    console.error("❌ Error adding item:", error.response?.data || error.message);
			    throw new Error('Failed to add item in cart.');
			   }
		},

		// Update item
		async updateItem(cart_key, item_key, quantity) {
			try {
				if (!cart_key) throw new Error("Cart key is required");
				if (!item_key) throw new Error("Item key is required");
				if (!quantity) throw new Error("Quantity is required");

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
			try {
				if (!cart_key) throw new Error("Cart key is required");
				if (!item_key) throw new Error("Item key is required");

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