const createTableSql = [
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role ENUM('admin', 'user') DEFAULT 'user'
    )`,
    `
    CREATE TABLE IF NOT EXISTS schema (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS schema_fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        schema_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type ENUM('text', 'number', 'date', 'boolean') NOT NULL,
        required BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (schema_id) REFERENCES schema(id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS instance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        schema_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (schema_id) REFERENCES schema(id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS instance_fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instance_id INT NOT NULL,
        field_id INT NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instance_id) REFERENCES instance(id),
        FOREIGN KEY (field_id) REFERENCES schema_fields(id)
    )
    `

];

export { createTableSql };
