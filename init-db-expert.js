import Database from 'better-sqlite3';

const db = new Database('sql_practice_expert.db');

// Create complex e-commerce database schema
db.exec(`
  DROP TABLE IF EXISTS order_items;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS inventory;
  DROP TABLE IF EXISTS suppliers;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
  );

  CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    rating DECIMAL(3,2)
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER,
    supplier_id INTEGER,
    price DECIMAL(10,2),
    cost DECIMAL(10,2),
    created_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
  );

  CREATE TABLE inventory (
    product_id INTEGER PRIMARY KEY,
    quantity INTEGER NOT NULL,
    last_restocked TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    registration_date TEXT NOT NULL,
    loyalty_points INTEGER DEFAULT 0
  );

  CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date TEXT NOT NULL,
    status TEXT NOT NULL,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    customer_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

// Insert categories
const insertCat = db.prepare('INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)');
[
  [1, 'Electronics', null],
  [2, 'Laptops', 1],
  [3, 'Phones', 1],
  [4, 'Accessories', 1],
  [5, 'Clothing', null],
  [6, 'Men', 5],
  [7, 'Women', 5],
  [8, 'Books', null]
].forEach(cat => insertCat.run(...cat));

// Insert suppliers
const insertSup = db.prepare('INSERT INTO suppliers (id, name, country, rating) VALUES (?, ?, ?, ?)');
[
  [1, 'TechCorp', 'USA', 4.5],
  [2, 'GlobalElectronics', 'China', 4.2],
  [3, 'EuroSupply', 'Germany', 4.8],
  [4, 'AsiaManufacturing', 'Japan', 4.6],
  [5, 'LocalGoods', 'USA', 3.9]
].forEach(sup => insertSup.run(...sup));

// Insert products
const insertProd = db.prepare('INSERT INTO products (id, name, category_id, supplier_id, price, cost, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
[
  [1, 'MacBook Pro', 2, 1, 2499.99, 1800.00, '2023-01-15'],
  [2, 'Dell XPS 15', 2, 3, 1899.99, 1400.00, '2023-02-20'],
  [3, 'iPhone 14', 3, 1, 999.99, 700.00, '2023-01-10'],
  [4, 'Samsung Galaxy S23', 3, 2, 899.99, 650.00, '2023-03-05'],
  [5, 'Wireless Mouse', 4, 4, 29.99, 12.00, '2023-01-20'],
  [6, 'USB-C Cable', 4, 2, 19.99, 5.00, '2023-02-15'],
  [7, 'Laptop Bag', 4, 5, 49.99, 20.00, '2023-01-25'],
  [8, 'Men T-Shirt', 6, 5, 24.99, 10.00, '2023-03-01'],
  [9, 'Women Dress', 7, 5, 79.99, 35.00, '2023-03-10'],
  [10, 'SQL Mastery Book', 8, 3, 39.99, 15.00, '2023-02-01']
].forEach(prod => insertProd.run(...prod));

// Insert inventory
const insertInv = db.prepare('INSERT INTO inventory (product_id, quantity, last_restocked) VALUES (?, ?, ?)');
[
  [1, 15, '2023-11-01'],
  [2, 25, '2023-11-15'],
  [3, 50, '2023-11-20'],
  [4, 40, '2023-11-18'],
  [5, 200, '2023-10-30'],
  [6, 500, '2023-11-10'],
  [7, 30, '2023-11-05'],
  [8, 100, '2023-11-12'],
  [9, 60, '2023-11-08'],
  [10, 80, '2023-10-25']
].forEach(inv => insertInv.run(...inv));

// Insert customers
const insertCust = db.prepare('INSERT INTO customers (id, name, email, country, registration_date, loyalty_points) VALUES (?, ?, ?, ?, ?, ?)');
[
  [1, 'John Smith', 'john@email.com', 'USA', '2022-01-15', 1500],
  [2, 'Emma Wilson', 'emma@email.com', 'UK', '2022-03-20', 2300],
  [3, 'Carlos Rodriguez', 'carlos@email.com', 'Spain', '2022-06-10', 800],
  [4, 'Yuki Tanaka', 'yuki@email.com', 'Japan', '2022-02-28', 1200],
  [5, 'Sophie Martin', 'sophie@email.com', 'France', '2022-08-15', 500],
  [6, 'Michael Brown', 'michael@email.com', 'USA', '2023-01-10', 300],
  [7, 'Lisa Anderson', 'lisa@email.com', 'Canada', '2022-05-22', 1800],
  [8, 'Ahmed Hassan', 'ahmed@email.com', 'Egypt', '2022-09-30', 950],
  [9, 'Maria Garcia', 'maria@email.com', 'Mexico', '2022-04-18', 1100],
  [10, 'David Lee', 'david@email.com', 'USA', '2023-02-14', 200]
].forEach(cust => insertCust.run(...cust));

// Insert orders
const insertOrder = db.prepare('INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES (?, ?, ?, ?, ?)');
[
  [1, 1, '2023-11-01', 'completed', 2529.98],
  [2, 2, '2023-11-02', 'completed', 999.99],
  [3, 3, '2023-11-03', 'completed', 54.98],
  [4, 1, '2023-11-05', 'completed', 1899.99],
  [5, 4, '2023-11-06', 'shipped', 929.98],
  [6, 5, '2023-11-07', 'completed', 39.99],
  [7, 2, '2023-11-08', 'completed', 104.98],
  [8, 6, '2023-11-09', 'processing', 2499.99],
  [9, 7, '2023-11-10', 'completed', 899.99],
  [10, 8, '2023-11-11', 'completed', 79.99],
  [11, 1, '2023-11-12', 'cancelled', 0],
  [12, 9, '2023-11-13', 'completed', 149.97],
  [13, 10, '2023-11-14', 'shipped', 999.99],
  [14, 3, '2023-11-15', 'completed', 24.99],
  [15, 4, '2023-11-16', 'completed', 2499.99]
].forEach(order => insertOrder.run(...order));

// Insert order items
const insertOrderItem = db.prepare('INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)');
[
  [1, 1, 1, 1, 2499.99],
  [2, 1, 5, 1, 29.99],
  [3, 2, 3, 1, 999.99],
  [4, 3, 5, 1, 29.99],
  [5, 3, 6, 1, 24.99],
  [6, 4, 2, 1, 1899.99],
  [7, 5, 4, 1, 899.99],
  [8, 5, 5, 1, 29.99],
  [9, 6, 10, 1, 39.99],
  [10, 7, 8, 3, 24.99],
  [11, 7, 5, 1, 29.99],
  [12, 8, 1, 1, 2499.99],
  [13, 9, 4, 1, 899.99],
  [14, 10, 9, 1, 79.99],
  [15, 12, 7, 3, 49.99],
  [16, 13, 3, 1, 999.99],
  [17, 14, 8, 1, 24.99],
  [18, 15, 1, 1, 2499.99]
].forEach(item => insertOrderItem.run(...item));

// Insert reviews
const insertReview = db.prepare('INSERT INTO reviews (id, product_id, customer_id, rating, review_text, review_date) VALUES (?, ?, ?, ?, ?, ?)');
[
  [1, 1, 1, 5, 'Excellent laptop!', '2023-11-05'],
  [2, 3, 2, 5, 'Best phone ever', '2023-11-06'],
  [3, 5, 3, 4, 'Good mouse', '2023-11-07'],
  [4, 2, 1, 5, 'Great performance', '2023-11-10'],
  [5, 4, 4, 4, 'Nice phone', '2023-11-12'],
  [6, 10, 5, 5, 'Very informative book', '2023-11-08'],
  [7, 8, 2, 3, 'Average quality', '2023-11-13'],
  [8, 1, 6, 5, 'Worth the price', '2023-11-14'],
  [9, 9, 8, 4, 'Beautiful dress', '2023-11-15'],
  [10, 4, 7, 5, 'Amazing phone', '2023-11-16']
].forEach(review => insertReview.run(...review));

console.log('Expert database initialized with e-commerce data!');
db.close();
