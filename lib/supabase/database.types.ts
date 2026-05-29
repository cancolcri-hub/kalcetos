export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export interface Database {
  kalcetos: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          segment: string;
          brand: string | null;
          description_short: string | null;
          description_long: string | null;
          meta_title: string | null;
          meta_description: string | null;
          base_price_cents: number;
          compare_at_price_cents: number | null;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          segment: string;
          brand?: string | null;
          description_short?: string | null;
          description_long?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          base_price_cents: number;
          compare_at_price_cents?: number | null;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["kalcetos"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string | null;
          color: string | null;
          stock: number;
          price_cents: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size?: string | null;
          color?: string | null;
          stock?: number;
          price_cents?: number | null;
          created_at?: string;
        };
        Update: Partial<
          Database["kalcetos"]["Tables"]["product_variants"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          position: number;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          position?: number;
          is_primary?: boolean;
        };
        Update: Partial<
          Database["kalcetos"]["Tables"]["product_images"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          postal_code: string | null;
          country: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string;
          created_at?: string;
        };
        Update: Partial<Database["kalcetos"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          stripe_session_id: string;
          status: OrderStatus;
          subtotal_cents: number;
          shipping_cents: number;
          tax_cents: number;
          total_cents: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          stripe_session_id: string;
          status?: OrderStatus;
          subtotal_cents?: number;
          shipping_cents?: number;
          tax_cents?: number;
          total_cents?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["kalcetos"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          quantity: number;
          unit_price_cents: number;
          line_total_cents: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id: string;
          quantity: number;
          unit_price_cents: number;
          line_total_cents: number;
        };
        Update: Partial<
          Database["kalcetos"]["Tables"]["order_items"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      product_status: ProductStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
