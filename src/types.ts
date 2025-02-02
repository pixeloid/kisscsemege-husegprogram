export interface UserProfile {
    barcode: string;
    id: string;
    user_id: string;
    name: string;
    phone_number: string;
    created_at: Date;
}

export interface Purchase {
    id: string;
    user_id: string;
    purchase_date: Date;
    total_amount: number;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    created_at: Date;
}

export interface UserLevel {
    id: string;
    user_id: string;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    updated_at: Date;
    created_at: Date;
}