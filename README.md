Admin more features:

endpoint:
Post: api/Users
reqbody:
{
  "username": "string",
  "password": "string",
  "role": "string"
}

Product managements:
Get: /api/Products
response:
[
  {
    "id": 11,
    "barcode": "QR000010",
    "name": "Amul Butter",
    "unit": "500g",
    "sellPrice": 250,
    "stockQty": 18,
    "rowVersion": null,
    "createdAt": "2025-08-08T14:59:29.308628",
    "updatedAt": "2025-08-08T14:59:29.308628"
  }
]

Post: /api/Products

{
  "barcode": "string",
  "name": "string",
  "unit": "string",
  "sellPrice": 0,
  "stockQty": 0
}

Put: /api/Products/{id}
{
  "name": "string",
  "unit": "string",
  "sellPrice": 0,
  "stockQty": 0
}

Delete: /api/Products/{id}


Sales information
Get: api/Batches
response:
[
  {
    "id": 3,
    "batchCode": "fwwDwVVEqyDp",
    "customerId": "ASbbJeS9t0W6",
    "status": "Created",
    "subtotal": 0,
    "discountAmount": 0,
    "discountPercent": 0,
    "payable": 0,
    "givenAmount": 0,
    "paymentMethod": "None",
    "returnedAmount": 0,
    "productId": null,
    "productName": null,
    "items": []
  },
  {
    "id": 2,
    "batchCode": "vyQ3XkOgckSW",
    "customerId": "mUhv30GmoEyX",
    "status": "Paid",
    "subtotal": 980,
    "discountAmount": 0,
    "discountPercent": 0,
    "payable": 980,
    "givenAmount": 0,
    "paymentMethod": "None",
    "returnedAmount": 0,
    "productId": 4,
    "productName": "Dettol Handwash",
    "items": [
      {
        "id": 2,
        "barcode": "123",
        "productName": "Dove",
        "qty": 3,
        "unitPrice": 70,
        "lineTotal": 210
      },
      {
        "id": 3,
        "barcode": "QR000001",
        "productName": "Dove Soap",
        "qty": 6,
        "unitPrice": 75,
        "lineTotal": 450
      },
      {
        "id": 4,
        "barcode": "QR000003",
        "productName": "Dettol Handwash",
        "qty": 4,
        "unitPrice": 80,
        "lineTotal": 320
      }
    ]
  }
  ]


PUT: api/Batches/{id}/status
{
  "status": "string",
  "givenAmount": 0,
  "paymentMethod": "string",
  "discountAmount": 0,
  "discountPercent": 0,
  "returnedAmount": 0
}
