import requests
import sys

BASE_URL = "http://localhost:8001"

def run_tests():
    print("=== Testing Backend APIs ===")

    # 1. Login
    print("\n1. Testing Login...")
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

    # 2. Setup Data (Categories, Companies, UnitTypes)
    print("\n2. Testing Setup endpoints (Categories, Companies, UnitTypes)...")
    cat_res = requests.post(f"{BASE_URL}/setup/categories", json={"name": "Antibiotics", "description": "Test Category"}, headers=headers)
    if cat_res.status_code not in [200, 201]: print(f"Category creation failed: {cat_res.text}")
    else: print("Created Category.")

    comp_res = requests.post(f"{BASE_URL}/setup/companies", json={"name": "Pharma Inc", "phone": "1234567890", "address": "123 Test St"}, headers=headers)
    if comp_res.status_code not in [200, 201]: print(f"Company creation failed: {comp_res.text}")
    else: print("Created Company.")

    unit_res = requests.post(f"{BASE_URL}/setup/unitTypes", json={"name": "Box", "description": "Test Box"}, headers=headers)
    if unit_res.status_code not in [200, 201]: print(f"UnitType creation failed: {unit_res.text}")
    else: print("Created UnitType.")

    # 3. Create Pharmacy Product
    print("\n3. Testing Product Creation...")
    product_data = {
        "tradeName": "Amoxicillin",
        "genericName": "Amox",
        "category": "Antibiotics",
        "company": "Pharma Inc",
        "stock": "100",
        "packMrp": "50",
        "unitMrp": "5",
        "addedBy": "admin"
    }
    prod_res = requests.post(f"{BASE_URL}/products/main", json=product_data, headers=headers)
    if prod_res.status_code not in [200, 201]: 
        print(f"Product creation failed: {prod_res.text}")
    else: 
        print("Created Pharmacy Product.")
        prod_id = prod_res.json().get("id")

    # 4. Fetch Products
    print("\n4. Testing GET Products...")
    get_prod = requests.get(f"{BASE_URL}/products/main", headers=headers)
    if get_prod.status_code != 200:
        print(f"Failed to fetch products: {get_prod.text}")
    else:
        products = get_prod.json()
        print(f"Successfully fetched {len(products)} products.")

    print("\n=== All basic flow tests completed! ===")

if __name__ == "__main__":
    run_tests()
