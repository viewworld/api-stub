
forms = {
    "list": [
        {
            "id": "construction",
            "title": "Construction",
            "owner": "Construct A/S",
            "active": True,
            "deletable": True,
            "reportCount": 28,
            "collections": [
                {
                    "id": "wells",
                    "title": "Wells",
                },
            ],
        },
        {
            "id": "household",
            "title": "Household survey",
            "owner": "Houses Inc.",
            "active": True,
            "deletable": False,
            "reportCount": 130,
            "collections": [
                {
                    "id": "wells",
                    "title": "Wells",
                },
            ],
        },
        {
            "id": "ricedestribution",
            "title": "IAA Rice destribution",
            "owner": "IAA",
            "active": False,
            "deletable": False,
            "reportCount": 26,
            "collections": [],
        },
    ],

    "single": {
        "id": "household",
        "title": "Household survey",
        "owner": "Houses Inc.",
        "deletable": False,
        "active": True,
        "reportCount": 130,
        "collections": [
            {
                "id": "wells",
                "title": "Wells",
            },
        ],
        "fields": [
            {
                "id": "well",
                "type": "object",
                "title": "Well",
                "hint": None,
                "collection": "well",
                "required": True,
                "default": None,
                "editable": True,
                "hidden": False,
            },
            {
                "id": "inhabitants",
                "type": "number",
                "title": "Inhabitants",
                "hint": None,
                "required": True,
                "default": None,
                "editable": True,
                "hidden": False,
            },
            {
                "id": "family",
                "type": "number",
                "title": "Family",
                "hint": None,
                "required": True,
                "default": None,
                "editable": True,
                "hidden": False,
            },
            {
                "id": "name",
                "type": "text",
                "title": "Name",
                "hint": None,
                "required": True,
                "default": None,
                "editable": True,
                "hidden": False,
                "minLength": None,
                "maxLength": None,
            },
            {
                "id": "children",
                "type": "number",
                "title": "Children",
                "required": True,
                "default": None,
                "editable": True,
                "hidden": False,
            },
        ],
    },
}

reports = [
    {
        "id": r[0],
        "public": False,
        "data": {
            "well": r[1],
            "inhabitants": r[2],
            "family": r[3],
            "name": r[4],
            "children": r[5],
        }
    }
	for r in [
		["504fb573-2d8b-47c5-a070-5f772f728978", "Makombera", "4550", "5", "James Kitui",  "5"],
		["28ba7e0b-7ad7-4865-a1e4-58c4e116fe7c", "Musoma",    "3520", "7", "Mary Matemu",  "3"],
		["59cbaeff-a076-4c0b-9117-e76c889210b5", "Kitengela", "2250", "6", "Ruth Odiambo", "2"],
		["025434c1-bb65-46ad-9599-f7db53be59ba", "Makombera", "4550", "5", "James Kitui",  "5"],
		["d1cc39d8-ccd2-4d5e-b509-8868a5cec80d", "Musoma",    "3520", "7", "Mary Matemu",  "3"],
		["8e2b4210-9fb7-4d3b-a46c-d79931c74ef5", "Kitengela", "2250", "6", "Ruth Odiambo", "2"],
		["d741dea3-ad3b-45e3-b28a-9797d8d45155", "Makombera", "4550", "5", "James Kitui",  "5"],
		["ff46e918-e72b-4142-bdfc-d2eb9301dc10", "Musoma",    "3520", "7", "Mary Matemu",  "3"],
		["8ad1899f-5006-4e4c-9070-77ba0550b4e6", "Kitengela", "2250", "6", "Ruth Odiambo", "2"],
		["60a831ac-a78f-44b4-ae4e-4914bff273d2", "Makombera", "4550", "5", "James Kitui",  "5"],
		["296c3e09-b5f5-49a3-8970-ff32c210ee4f", "Musoma",    "3520", "7", "Mary Matemu",  "3"],
		["dd7b67a4-1f88-4773-a814-2a058c22938e", "Kitengela", "2250", "6", "Ruth Odiambo", "2"]
	]
]

new_report = {
	"id": "85568c06-de4e-414d-86b5-c4f47f398c36",
}


collections = {
    "list": [
        {
            "id": "well",
            "title": "Wells",
            "reportCount": 125+85+52,
            "active": True,
            "forms": [
                {
                    "id": "construction",
                    "title": "Construction",
                    "reportCount": 125,
                },
                {
                    "id": "household",
                    "title": "Household survey",
                    "reportCount": 85,
                },
                {
                    "id": "health",
                    "title": "Health survey",
                    "reportCount": 52,
                },
            ],
        },
        {
            "id": "diabetes-clinics",
            "title": "Diabetes clinics",
            "reportCount": 33+42+12,
            "active": True,
            "forms": [
                {
                    "id": "construction",
                    "title": "Construction",
                    "reportCount": 33,
                },
                {
                    "id": "household",
                    "title": "Household survey",
                    "reportCount": 42,
                },
                {
                    "id": "health",
                    "title": "Health survey",
                    "reportCount": 12,
                },
            ],
        },
        {
            "id": "tree-plantations",
            "title": "Tree plantations",
            "reportCount": 12+6+5,
            "active": True,
            "forms": [
                {
                    "id": "construction",
                    "title": "Construction",
                    "reportCount": 12,
                },
                {
                    "id": "household",
                    "title": "Household survey",
                    "reportCount": 6,
                },
                {
                    "id": "health",
                    "title": "Health survey",
                    "reportCount": 5,
                },
            ],
        },
        {
            "id": "bio-monitoring",
            "title": "Bio-monitoring",
            "reportCount": 0,
            "active": False,
            "forms": [],
        },
    ],

    "single": {
        "id": "well",
        "title": "Wells",
        "reportCount": 125+85+52,
        "active": True,
        "forms": [
            {
                "id": "construction",
                "title": "Construction",
                "reportCount": 125,
            },
            {
                "id": "household",
                "title": "Household survey",
                "reportCount": 85,
            },
            {
                "id": "health",
                "title": "Health survey",
                "reportCount": 52,
            },
        ],
        "objects": [
            {
                "id": "c3f33957-c54d-4596-8d70-c4d4a13728e5",
                "title": "Markombera",
                "reportCount": 90,
                "forms": [
                    {
                        "id": "construction",
                        "title": "Construction",
                        "reportCount": 45,
                    },
                    {
                        "id": "household",
                        "title": "Household survey",
                        "reportCount": 28,
                    },
                    {
                        "id": "health",
                        "title": "Health survey",
                        "reportCount": 17,
                    },
                ],
            },
            {
                "id": "8bfce1a2-dd10-4d9e-93de-895861066239",

                "title": "Kitengela",
                "reportCount": 100,
                "forms": [
                    {
                        "id": "construction",
                        "title": "Construction",
                        "reportCount": 56,
                    },
                    {
                        "id": "household",
                        "title": "Household survey",
                        "reportCount": 23,
                    },
                    {
                        "id": "health",
                        "title": "Health survey",
                        "reportCount": 21,
                    },
                ],
            },
            {
                "id": "41c16572-b6b6-4327-a8f2-79e949349325",
                "title": "Musoma",
                "reportCount": 72,
                "forms": [
                    {
                        "id": "construction",
                        "title": "Construction",
                        "reportCount": 24,
                    },
                    {
                        "id": "household",
                        "title": "Household survey",
                        "reportCount": 34,
                    },
                    {
                        "id": "health",
                        "title": "Health survey",
                        "reportCount": 14,
                    },
                ],
            },
        ],
    }
}




