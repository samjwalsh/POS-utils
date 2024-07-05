const {
  serial,
  text,
  timestamp,
  integer,
  boolean,
  real,
  json,
  pgSchema,
} = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

const ordersSchema = pgSchema('orders_schema');
const paymentMethod = ordersSchema.enum('paymentMethod', ['Card', 'Cash']);
const ordersTable = ordersSchema.table('orders', {
  id: text('id').primaryKey(),
  time: timestamp('time').notNull(),
  shop: text('shop').notNull(),
  till: integer('till').notNull(),
  deleted: boolean('deleted').notNull(),
  eod: boolean('eod').notNull(),
  rba: boolean('rba').default(false),
  subtotal: real('subtotal').notNull(),
  paymentMethod: paymentMethod('payment_method').notNull(),
});

const orderRelations = relations(ordersTable, ({ many }) => ({
  items: many(itemsTable),
}));

const itemsSchema = pgSchema('items_schema');
const itemsTable = itemsSchema.table('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  addons: text('addons').array().notNull(),
  orderId: text('order_id').notNull(),
});

const itemsRelations = relations(itemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [itemsTable.orderId],
    references: [ordersTable.id],
  }),
}));

const vouchersSchema = pgSchema('vouchers_schema');
const vouchersTable = vouchersSchema.table('vouchers', {
  dateCreated: timestamp('date_created').notNull(),
  shopCreated: text('shop_created').notNull(),
  tillCreated: text('till_created').notNull(),
  value: real('value').notNull(),
  code: text('code').primaryKey(),
  redeemed: boolean('redeemed').notNull(),
  dateRedeemed: timestamp('date_redeemed'),
  shopRedeemed: text('shop_redeemed'),
  tillRedeemed: text('till_redeemed'),
});

const logsSchema = pgSchema('logs_schema');
const logsTable = logsSchema.table('logs', {
  id: serial('id').primaryKey(),
  time: timestamp('time').notNull(),
  source: text('source').notNull(),
  note: text('note'),
  json: json('json'),
  message: text('message'),
});

module.exports = { ordersTable, itemsTable, logsTable, vouchersTable };
