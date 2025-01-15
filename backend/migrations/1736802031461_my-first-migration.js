/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        firstName: { type: 'varchar(100)' },
        lastName: { type: 'varchar(100)' },
        email: { type: 'varchar(100)', notNull: true },
        password: { type: 'varchar(150)', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};