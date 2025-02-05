USE test;

CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Primary key, unique and not null
    title VARCHAR(255) NOT NULL,         -- Title must not be null
    description TEXT NOT NULL,           -- Description must not be null
    cover VARCHAR(255) NULL,             -- Cover can be null (nullable field)
    price DECIMAL(10,2) NOT NULL         -- Price must not be null
);
