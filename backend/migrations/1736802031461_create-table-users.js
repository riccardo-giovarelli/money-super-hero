/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
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
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('users', 'email', { name: 'users_email_unique', unique: true });

    pgm.createFunction('update_updated_at_timestamp', [], {
        returns: 'trigger',
        language: 'plpgsql',
    }, `
        BEGIN
            NEW."updatedAt" = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
    `);

    pgm.createTrigger('users', 'set_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_timestamp',
    });
}

export function down(pgm) {
    pgm.dropTrigger('users', 'set_updated_at');
    pgm.dropFunction('update_updated_at_timestamp');
    pgm.dropIndex('users', 'email', { name: 'users_email_unique' });
    pgm.dropTable('users');
}