export default function createApiClient(siteURL: string): {
    getProducts(): Promise<any>;
    getCart(cart_key: string): Promise<{
        total_amount: number;
        total_items: any;
        currency_symbol: any;
        cart_items: any;
    } | {
        success: boolean;
        error: any;
    }>;
    addToCart(cart_key: string | undefined, id: string, quantity?: string): Promise<any>;
    updateItem(cart_key: string, item_key: string, quantity: string): Promise<any>;
    removeItem(cart_key: string, item_key: string): Promise<any>;
};
