from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
db = SQLAlchemy()


class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    employee_code = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.Text, nullable=False)
    surname = db.Column(db.Text, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=sa.func.now())

    __table_args__ = (
        db.CheckConstraint(
            "category IN ('Garden', 'DIY', 'Construction', 'Tools')",
            name="valid_category"
        ),
    )

    def __repr__(self):
        return f'<Employee {self.name}>'


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.Text, nullable=False)
    category = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    shelf_stock = db.Column(db.Integer, nullable=False)
    warehouse_stock = db.Column(db.Integer, nullable=False)
    total_stock = db.Column(db.Integer)
    aile = db.Column(db.Text, nullable=False)
    section = db.Column(db.Text, nullable=False)
    shelf = db.Column(db.Text, nullable=False)
    last_updated = db.Column(db.DateTime(timezone=True), server_default=sa.func.now())

    __table_args__ = (
        db.CheckConstraint('shelf_stock >= 0', name='shelf_stock_positive'),
        db.CheckConstraint('warehouse_stock >= 0', name='warehouse_stock_positive'),
        db.CheckConstraint('price >= 0', name='price_non_negative'),
    )

    @property
    def total_stock_calc(self):
        return self.shelf_stock + self.warehouse_stock


class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    requested_at = db.Column(db.DateTime(timezone=True), server_default=sa.func.now())
    district = db.Column(db.Text, nullable=False)
    status = db.Column(db.Text, server_default='pending', nullable=False)
    handled_by = db.Column(db.Integer, db.ForeignKey('employees.id'))
    scanned_at = db.Column(db.DateTime(timezone=True))
    delivered_at = db.Column(db.DateTime(timezone=True))

    __table_args__ = (
        db.CheckConstraint(
            "status IN ('pending', 'picked', 'in_transit', 'delivered')",
            name="valid_request_status"
        ),
    )
