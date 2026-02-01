-- Создание таблицы статусов заказов
CREATE TABLE IF NOT EXISTS order_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#0EA5E9',
    description TEXT,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы пунктов выдачи
CREATE TABLE IF NOT EXISTS pickup_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(50) NOT NULL CHECK (country IN ('russia', 'abkhazia')),
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    working_hours VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    pickup_point_from INTEGER REFERENCES pickup_points(id),
    pickup_point_to INTEGER REFERENCES pickup_points(id),
    delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('pickup', 'home')),
    delivery_address TEXT,
    weight DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    price DECIMAL(10, 2) NOT NULL,
    qr_code_url TEXT,
    screenshot_url TEXT,
    current_status_id INTEGER REFERENCES order_statuses(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы истории статусов заказа
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    status_id INTEGER REFERENCES order_statuses(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных статусов
INSERT INTO order_statuses (name, color, description, order_position) VALUES
    ('Новый заказ', '#3B82F6', 'Заказ создан, ожидает обработки', 1),
    ('Получен', '#10B981', 'Посылка получена на складе в России', 2),
    ('На складе', '#F59E0B', 'Посылка находится на складе', 3),
    ('В пути', '#8B5CF6', 'Посылка отправлена в Абхазию', 4),
    ('Прибыл в пункт выдачи', '#06B6D4', 'Посылка прибыла в пункт выдачи', 5),
    ('Доставлен', '#22C55E', 'Посылка успешно доставлена', 6),
    ('Отменён', '#EF4444', 'Заказ отменён', 7)
ON CONFLICT (name) DO NOTHING;

-- Вставка начальных пунктов выдачи в России
INSERT INTO pickup_points (name, country, city, address, phone, working_hours) VALUES
    ('Склад Адлер (Центральный)', 'russia', 'Адлер', 'ул. Ленина, 45', '+79407131999', 'Пн-Сб: 9:00-20:00'),
    ('Пункт OZON Адлер', 'russia', 'Адлер', 'ул. Демократическая, 12', '+79409061999', 'Ежедневно: 10:00-22:00'),
    ('Wildberries Адлер', 'russia', 'Адлер', 'ТЦ Мандарин, 2 этаж', '+79407131999', 'Ежедневно: 10:00-21:00'),
    ('Почта России Адлер', 'russia', 'Адлер', 'ул. Просвещения, 78', '+79409061999', 'Пн-Пт: 8:00-18:00')
ON CONFLICT DO NOTHING;

-- Вставка начальных пунктов выдачи в Абхазии
INSERT INTO pickup_points (name, country, city, address, phone, working_hours) VALUES
    ('Пункт выдачи Сухум (Центр)', 'abkhazia', 'Сухум', 'пр. Леона, 23', '+79407131999', 'Пн-Сб: 9:00-19:00'),
    ('Пункт выдачи Гагра', 'abkhazia', 'Гагра', 'ул. Абазгаа, 56', '+79409061999', 'Пн-Вс: 10:00-20:00'),
    ('Пункт выдачи Пицунда', 'abkhazia', 'Пицунда', 'ул. Гицба, 12', '+79407131999', 'Ежедневно: 9:00-18:00'),
    ('Пункт выдачи Новый Афон', 'abkhazia', 'Новый Афон', 'ул. Лакоба, 34', '+79409061999', 'Пн-Сб: 10:00-19:00')
ON CONFLICT DO NOTHING;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(current_status_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pickup_points_country ON pickup_points(country);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);
