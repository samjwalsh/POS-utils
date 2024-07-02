const { serial, text, timestamp, integer, boolean, real, pgSchema } = require("drizzle-orm/pg-core");
const { relations } = require('drizzle-orm');

const ordersSchema = pgSchema("orders_schema");
const paymentMethod = ordersSchema.enum('paymentMethod', ['Card', 'Cash']);
const orders = ordersSchema.table('orders', {
    id: text('id').primaryKey(),
    time: timestamp('time').notNull(),
    shop: text('shop').notNull(),
    till: integer('till').notNull(),
    deleted: boolean('deleted').notNull(),
    eod: boolean('eod').notNull(),
    subtotal: real('subtotal').notNull(),
    paymentMethod: paymentMethod('payment_method').notNull(),
});

const orderRelations = relations(orders, ({ many }) => ({
    items: many(items),
}));

const itemsSchema = pgSchema('items_schema');
const items = itemsSchema.table('items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    price: real('price').notNull(),
    quantity: integer('quantity').notNull(),
    addons: text('addons').array().notNull(),
    orderId: text('order_id').notNull()
})

const itemsRelations = relations(items, ({ one }) => ({
    order: one(orders, {
        fields: [items.orderId],
        references: [orders.id],
    }),
}));

module.exports = {
    ordersSchema,
    paymentMethod,
    orders,
    orderRelations,
    itemsSchema,
    items,
    itemsRelations,
}