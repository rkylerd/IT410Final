# User Account

| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |---------------| ------| ------|
| Create account | `/accounts` | POST |  |
| Update account | `/accounts/{username}` | PUT | username |
| Delete account | `/accounts/{username}` | DELETE | username |
| Authenticate account | `/authentications` | PUT |  |
| Validate address | `/address` | POST |  |


# User Queries
| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |---------------| ------| ------|
| Get all accounts | `/accounts` | GET |  |
| Get specific account | `/accounts/{username}` | GET | username |

```
//Set account info
{
    "username": "string",
    "password": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "array"
}
 
//get account info
{
    "username": "string",
    "password": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "array",
    "orderHistory": "array",
    "totalRevenue": "number"
}

//set guest info
{
    "email": "string",
    "phone": "string"
}
 
//get guest info
{
    "id": "string",
    "email": "string",
    "phone": "string",
    "orderHistory": "array",
    "totalRevenua": "number"
}
```

# Items
| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |---------------| ------| ------|
| Create Item | `/items` | POST |  |
| Update Item | `/items/{id}` | PUT | item id |
| Delete Item | `/items/{id}` | DELETE | item id |

# Items Queries
| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |---------------| ------| ------|
| Get all items | `/items` | GET |  |
| Get specific item | `/items/{id}` | GET | id of item |

``` 
//set item info
{
    "price": "number",
    "name": "string",
    "category": "string",
    "description": "string",
    "imageUrl": "string",
    "stock": "number",
    "size": "array",
    "promotionalFlag": "boolean",
    "promotionalprice": "number"
}
 
//get item info
{
    "id: "string"
    "name": "string",
    "price": "number",
    "category": "string",
    "description": "string",
    "imageUrl": "string",
    "stock": "number",
    "size": "array",
    "promotionalFlag": "boolean",
    "promotionalprice": "number"
}
```

# Orders
| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |---------------| ------| ------|
| Create Order | `/orders` | POST |  |
| Update Order | `/orders/{id}` | PUT | order id |
| Delete Order | `/orders/{id}` | DELETE | order id |

# Orders Queries
| Commands      | Endpoint  | Method  | Path Param(s)
| ------------- |-------------| -----| -----|
| Get all orders | `/orders` | GET |  |
| Get specific order | `/orders/{id}` | GET | order id |


``` 
// set order
{
    "items": [
        {
            "qty": 1,
            "size": "xxl",
            "otheritemsinfo": {}
        }
    ],
    "address": {
        "street1": "string",
        "street2":"",
        "city": "string",
        "state": "string",
        "zip": "number"
    },
    "userId": "string",
    "inPersonPickUp": "boolean"
}

// get order
{
    "id": "string",
    "price": "number",
    "dateCreated": "string",
    "inPersonPickUp": "boolean",
    "expectedArrivalDate": "string",
    "label": "string",
    "trackingId": "string",
    "items": [
        {
            "qty": 1,
            "size": "xxl",
            "otheritemsinfo": {}
        }
    ],
    "status": "string",
    "address": {
        "street1": "string",
        "street2":"",
        "city": "string",
        "state": "string",
        "zip": "number"
    },
    "userId": "string"
}
```

# Other data
```
// set rate 
{
    "id": "string"
}

// get rates
"rates": [
    {
        "id":"",
        "cost": 300,
        "carrier": "",
        "shippingTime": ""
    }
]
```