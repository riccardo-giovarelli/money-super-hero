/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
    pgm.createTable('transactions', {
        id: 'id',
        user_id: { type: 'integer', notNull: true, references: 'users' },
        timestamp: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        amount: { type: 'decimal', notNull: true },
        direction: { type: 'enum', notNull: true, values: ['IN', 'OUT'] },
        category: { type: 'integer', references: 'categories' },
        sub_category: { type: 'integer', references: 'sub_categories' },
        notes: { type: 'text' },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
    pgm.dropTable('transactions');
}
