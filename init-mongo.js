db.createUser(
    {
        user: "caps-secret-admin",
        pwd: "caps-secret-admin-pwd",
        roles: [
            {
                role: "readWrite",
                db: "caps-store"
            }
        ]
    }
)

// {
//     "price": 23.90,
//     "items": [
//         {
//             "qty": 1,
//             "size": "xxl",
//             "otheritemsinfo": {}
//         }
//     ],
//     "address": {
//         "street1": "786 nubt lane",
//         "street2":"",
//         "city": "provo",
//         "state": "az",
//         "zip": "89122"
//     },
//     "userId": "234324"
// }

// {
//     "name":"cool hat", 
//     "price":23.00, 
//     "category": "party", 
//     "description":"Reall cool hat for parties. Your friends will htink you're cool.", 
//     "imageUrl": "none right now", 
//     "stock": 2, 
//     "sizes": [ "small", "medium", "large"], 
//     "promotionalFlag": false, 
//     "promotionalPrice": 12.50
// }