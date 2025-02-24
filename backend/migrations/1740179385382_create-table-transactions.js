/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {

    pgm.createType('direction', ['IN', 'OUT']);

    pgm.createTable('transactions', {
        id: 'id',
        user_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
        timestamp: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        amount: { type: 'decimal', notNull: true },
        direction: { type: 'direction', notNull: true, defaultValue: 'IN' },
        category: { type: 'integer', references: 'categories', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
        sub_category: { type: 'integer', references: 'sub_categories', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
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
    pgm.dropType('direction');

}
