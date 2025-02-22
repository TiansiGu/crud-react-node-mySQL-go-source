CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,  
    title VARCHAR(255) NOT NULL,       
    description TEXT NOT NULL,          
    cover VARCHAR(255) NULL,            
    price DECIMAL(10,2) NOT NULL 
);
