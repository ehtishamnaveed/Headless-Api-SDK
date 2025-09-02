export default function createApiClient(siteURL: string): {
    getProducts(): Promise<any>;
    getCart(): Promise<{
        total_amount: number;
        total_items: any;
        currency_symbol: any;
        cart_items: any;
    } | {
        success: boolean;
        error: any;
    }>;
    addToCart(id: string, quantity?: string): Promise<{
        success: boolean;
        error: any;
    } | undefined>;
    updateItem(item_key: string, quantity: string): Promise<any>;
    removeItem(item_key: string): Promise<any>;
};
