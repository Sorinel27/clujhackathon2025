from datetime import datetime

import requests
import os
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash

from .models import db, Employee, Product, Request, StockAlert

FLOCKX_API_KEY = os.getenv("flockx_api_key")

main = Blueprint("main", __name__)


@main.route('/agent-prompt', methods=['POST'])
def agent_page():
    if request.method == 'POST':
        data = request.get_json()
        message = data.get('message')

        try:
            r = requests.post(
                "https://api.flockx.io/api/v1/agents/4b1fbb8e-ed44-4a88-9f63-b54107847a3c/prompt",
                headers={
                    "Authorization": f'Token {FLOCKX_API_KEY}'
                },
                json={
                    'prompt': message,
                }
            )

            # Raise an error for non-200 responses
            r.raise_for_status()

            # Try to parse the response as JSON
            json_data = r.json()
            response = json_data.get("message", "No message returned.")
            return jsonify({"message": response}), 200

        except requests.exceptions.HTTPError as e:
            return jsonify({"error": f"HTTP Error: {str(e)}", "details": r.text}), 500
        except requests.exceptions.RequestException as e:
            return jsonify({"error": f"Network Error: {str(e)}"}), 500
        except ValueError:
            return jsonify({"error": "Response is not valid JSON", "raw": r.text}), 500


@main.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category": p.category,
            "shelf_stock": p.shelf_stock,
            "warehouse_stock": p.warehouse_stock,
            "total_stock": p.shelf_stock + p.warehouse_stock,
            "last_updated": p.last_updated.isoformat() if p.last_updated else None
        }
        for p in products
    ])


# ===========================
# REQUESTS
# ===========================

@main.route("/api/requests", methods=["POST"])
def create_request():
    data = request.get_json()
    new_request = Request(
        product_id=data["product_id"],
        district=data["district"],
        status="pending"
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Request created", "id": new_request.id}), 201


@main.route("/api/requests/<int:req_id>/mark-delivered", methods=["PATCH"])
def mark_delivered(req_id):
    req = Request.query.get(req_id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    req.status = "delivered"
    db.session.commit()
    return jsonify({"message": "Request marked as delivered"})


@main.route("/api/requests", methods=["GET"])
def get_requests():
    requests = Request.query.all()
    return jsonify([
        {
            "id": r.id,
            "product_id": r.product_id,
            "district": r.district,
            "status": r.status,
            "requested_at": r.requested_at.isoformat() if r.requested_at else None,
            "delivered_at": r.delivered_at.isoformat() if r.delivered_at else None
        }
        for r in requests
    ])


@main.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    employee = Employee.query.filter_by(employee_code=data["employee_code"]).first()

    if not employee or not check_password_hash(employee.password_hash, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "id": employee.id,
        "employee_code": employee.employee_code,
        "name": employee.name,
        "surname": employee.surname,
        "category": employee.category
    })

@main.route("/api/products/<int:product_id>", methods=["PATCH"])
def update_product(product_id):
    data = request.get_json()
    product = Product.query.get_or_404(product_id)

    product.shelf_stock = data.get("shelf_stock", product.shelf_stock)
    product.warehouse_stock = data.get("warehouse_stock", product.warehouse_stock)
    product.total_stock = product.shelf_stock + product.warehouse_stock
    product.last_updated = datetime.utcnow()

    db.session.commit()
    return jsonify({"success": True})

@main.route('/api/alerts', methods=['GET'])
def get_alerts():
    alerts = StockAlert.query.filter_by(resolved_at=None).all()
    return jsonify([
        {
            "id": alert.id,
            "product_id": alert.product_id,
            "alert_type": alert.alert_type,
            "message": alert.message,
            "created_at": alert.created_at.isoformat(),
            "resolved_at": alert.resolved_at,
            "resolved_by": alert.resolved_by
        } for alert in alerts
    ])