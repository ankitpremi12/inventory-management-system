import requests
import sys

BASE_URL = "https://inventory-management-system-tbza.onrender.com"

def seed_db():
    print(f"=== Seeding Remote Backend at {BASE_URL} ===")

    # 1. Register Admin User
    print("\n1. Registering User...")
    user_data = {
        "email": "admin@example.com",
        "password": "password123"
    }
    # ignore if already registered
    res = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    if res.status_code == 201:
        print("Registered admin@example.com successfully.")
    elif res.status_code == 400 and "already registered" in res.text.lower():
        print("User already registered.")
    else:
        print(f"Registration failed: {res.status_code} {res.text}")

    # 2. Login
    print("\n2. Logging In...")
    login_data = {
        "username": "admin@example.com",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if res.status_code != 200:
        print(f"Login failed! {res.status_code} {res.text}")
        sys.exit(1)
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful! Got token.")

    # 3. Setup Data (Categories, Companies, UnitTypes)
    print("\n3. Seeding Setup endpoints (Categories, Companies, UnitTypes)...")
    cat_res = requests.post(f"{BASE_URL}/setup/categories", json={"name": "Antibiotics", "description": "Medicines used to prevent and treat bacterial infections"}, headers=headers)
    if cat_res.status_code not in [200, 201]: print(f"Category creation failed: {cat_res.text}")
    else: print("Created Category: Antibiotics.")
    
    cat_res = requests.post(f"{BASE_URL}/setup/categories", json={"name": "Electronics", "description": "Electronic devices and accessories"}, headers=headers)
    
    comp_res = requests.post(f"{BASE_URL}/setup/companies", json={"name": "Pharma Inc", "phone": "1234567890", "address": "123 Health Ave", "description": "Supplier of antibiotics"}, headers=headers)
    if comp_res.status_code not in [200, 201]: print(f"Company creation failed: {comp_res.text}")
    else: print("Created Company: Pharma Inc.")

    comp_res = requests.post(f"{BASE_URL}/setup/companies", json={"name": "Tech Corp", "phone": "0987654321", "address": "456 Silicon Valley", "description": "Electronics supplier"}, headers=headers)

    unit_res = requests.post(f"{BASE_URL}/setup/unitTypes", json={"name": "Box", "description": "Standard box packaging"}, headers=headers)
    if unit_res.status_code not in [200, 201]: print(f"UnitType creation failed: {unit_res.text}")
    else: print("Created UnitType: Box.")
    
    unit_res = requests.post(f"{BASE_URL}/setup/unitTypes", json={"name": "Pieces", "description": "Individual pieces"}, headers=headers)

    # 4. Create Pharmacy Product
    print("\n4. Seeding Products...")
    product_data = {
        "tradeName": "Amoxicillin",
        "genericName": "Amox",
        "category": "Antibiotics",
        "company": "Pharma Inc",
        "stock": "150",
        "packMrp": "50",
        "unitMrp": "5",
        "addedBy": "admin"
    }
    prod_res = requests.post(f"{BASE_URL}/products/main", json=product_data, headers=headers)
    if prod_res.status_code not in [200, 201]: 
        print(f"Pharmacy Product creation failed: {prod_res.text}")
    else: 
        print("Created Pharmacy Product: Amoxicillin.")

    # 5. Create Non-Pharmacy Product
    product_data2 = {
        "itemName": "Laptop Battery",
        "category": "Electronics",
        "company": "Tech Corp",
        "stock": "35",
        "price": "45.00",
        "description": "Lithium-ion laptop battery",
        "addedBy": "admin"
    }
    prod_res2 = requests.post(f"{BASE_URL}/products/supplies", json=product_data2, headers=headers)
    if prod_res2.status_code not in [200, 201]: 
        print(f"Non-Pharmacy Product creation failed: {prod_res2.text}")
    else: 
        print("Created Non-Pharmacy Product: Laptop Battery.")

    # 6. Create Customer
    customer_data = {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "555-1234",
        "addedBy": "admin"
    }
    cust_res = requests.post(f"{BASE_URL}/customers", json=customer_data, headers=headers)
    if cust_res.status_code not in [200, 201]: 
        print(f"Customer creation failed: {cust_res.text}")
    else: 
        print("Created Customer: John Doe.")

    print("\n=== Remote seeding completed successfully! ===")

if __name__ == "__main__":
    seed_db()
