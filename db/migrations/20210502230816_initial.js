// eslint-disable-next-line no-unused-vars
import * as Knex from 'knex';

import tableNames from '../../src/constants/tableNames.js';

function addDefaultColumns (knex, table) {
  table.timestamps(false, true);
  table.dateTime('deleted_at').notNullable().defaultTo(knex.fn.now());
}

function addReferences (table, tableName) {
  table
    .integer(`${tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName);
}

/**
 * @param {Knex} knex
 */
export const up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable();
      table.string('email', 254).notNullable();
      table.string('password', 127).notNullable();
      table.dateTime('last_login');
      addDefaultColumns(knex, table);
    }),
    knex.schema.createTable(tableNames.tag, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable();
      table.string('desc', 1000);
      addDefaultColumns(knex, table);
    }),
    knex.schema.createTable(tableNames.category, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable().unique();
      addDefaultColumns(knex, table);
    }),
    knex.schema.createTable(tableNames.pool, (table) => {
      table.increments().notNullable();
      table.string('name');
      table.dateTime('start_date').notNullable();
      table.dateTime('end_date').notNullable();
      addDefaultColumns(knex, table);
    }),
    knex.schema.createTable(tableNames.chat_room, (table) => {
      table.increments().notNullable();
      table.string('theme');
      addDefaultColumns(knex, table);
    }),
  ]);
  await knex.schema.createTable(tableNames.bill, (table) => {
    table.increments().notNullable();
    table.float('cost');
    addDefaultColumns(knex, table);
    addReferences(table, tableNames.user);
    addReferences(table, tableNames.pool);
  });
  await knex.schema.createTable(tableNames.todo_list, (table) => {
    table.increments().notNullable();
    table.string('titre').notNullable();
    table.dateTime('deadline');
    addDefaultColumns(knex, table);
    addReferences(table, tableNames.user);
    addReferences(table, tableNames.pool);
  });
  await knex.schema.createTable(tableNames.todo_item, (table) => {
    table.increments().notNullable();
    table.string('titre').notNullable();
    table.string('description', 1000);
    table.dateTime('deadline');
    addDefaultColumns(knex, table);
    addReferences(table, tableNames.todo_list);
    addReferences(table, tableNames.user);
  });
  await knex.schema.createTable(tableNames.grocery, (table) => {
    table.increments().notNullable();
    table.string('titre');
    table.string('state').notNullable();
    addDefaultColumns(knex, table);
    addReferences(table, tableNames.bill);
  });
  await knex.schema.createTable(tableNames.item, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('description', 1000);
    table.dateTime('purchased_date').notNullable();
    table.dateTime('expiration_date');
    table.dateTime('last_used');
    addDefaultColumns(knex, table);
    addReferences(table, tableNames.tag);
    addReferences(table, tableNames.category);
  });
  await knex.schema.createTable(tableNames.user_item, (table) => {
    table.increments().notNullable();
    addReferences(table, tableNames.user);
    addReferences(table, tableNames.item);
  });
  await knex.schema.createTable(tableNames.grocery_item, (table) => {
    table.increments().notNullable();
    addReferences(table, tableNames.grocery);
    addReferences(table, tableNames.item);
  });
  await knex.schema.createTable(tableNames.room_user, (table) => {
    table.increments().notNullable();
    addReferences(table, tableNames.user);
    addReferences(table, tableNames.chat_room);
  });
  await knex.schema.createTable(tableNames.message, (table) => {
    table.increments().notNullable();
    table.string('body').notNullable();
    table.boolean('received').notNullable();
    addReferences(table, tableNames.user);
    addReferences(table, tableNames.chat_room);
  });
};

/**
 * @param {Knex} knex
 */
export const down = async (knex) => {
  await Promise.all([
    tableNames.message,
    tableNames.room_user,
    tableNames.grocery_item,
    tableNames.user_item,
    tableNames.item,
    tableNames.grocery,
    tableNames.todo_item,
    tableNames.todo_list,
    tableNames.bill,
    tableNames.chat_room,
    tableNames.user,
    tableNames.tag,
    tableNames.category,
    tableNames.pool,
  ]).map((table_name) => knex.schema.dropTable(table_name));
};
