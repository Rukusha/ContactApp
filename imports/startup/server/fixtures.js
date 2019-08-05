import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';

import { PartnersMinimal } from '../../api/PartnersMinimal/PartnersMinimal';
import { ProjectsMinimal } from '../../api/ProjectsMinimal/ProjectsMinimal';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';
import { Users } from '../../api/users/users';

const initialUser = [
    {
        "_id": "ngrCLuKYiRA6gshXM",
        "services": {
            "password": {
                "bcrypt": "$2b$10$AJaGl2l8EnMcRdt5n8EaWeukIw4XkzoxeRYOSbBUH9fij4ZgYjaFC"
            },
            "resume": {
                "loginTokens": [
                ]
            }
        },
        "emails": [
            {
                "address": "admin@gmail.com",
                "verified": false
            }
        ],
        "profile": {
            "telephone": "01837462",
            "name": "Admin",
            "skype": "AdminSkype",
            "linkedIn": "AdminLinkedIn"
        },
        "roles": {
            "default-group": [
                "admin"
            ]
        }
    }
];
const initialProject = [
    {
        "_id": "Pop9ZC8FNvNDRPbNs",
        "alias": "red-alert",
        "owner": ["SRy76ccSYLZQ4TjJZ"],
        "name": "RED ALERT",
        "flagged" : false,
        "domain": "https://redalertproject.eu/",
        "bio": "Online Terrorist Content based on Natural Language Processing, Social Network Analysis, Artificial Intelligence and Complex Event Processing ",
        "logo": "assets/images/logos/red-alert.png",
        "individuals": [],
        "partners": [
            {
                "_id" : "SRy76ccSYLZQ4TjJZ",
                "name" : "INFORMATION CATALYST",
                "alias" : "information-catalyst",
                "logo": 'assets/images/logos/ice-infomation-catalyst-logo.jpg',
                "owner" : [ 
                    "SRy76ccSYLZQ4TjJZ"
                ],
                "flagged" : false,
                "domain" : "http://informationcatalyst.com/",
                "bio" : "ICE is a specialist consultancy assisting partners improve their business activities through cutting edge research and innovation, custom software development, and commercial consultancy services. ICE specialises in handling and processing of data, coming from heterogeneous sources in multiple formats and different domains. Our specialised solutions enable enterprises to remain competitive in a rapidly evolving domains."
            }
        ],
            "individuals": [
                {
                    "_id" : "XNoe6aMeJSshimJ4h",
                    "alias" : "michael-laubscher",
                    "name" : "Michael Laubscher",
                    "owner" : [ 
                        "SRy76ccSYLZQ4TjJZ"
                    ],
                    "flagged" : false,
                    "logo" : "assets/images/pictures/Michael-ice.jpeg",
                    "bio" : "A placement student",
                    "position" : "Junior Developer",
                    "linkedIn" : "linkedinname",
                    "skype" : "live:michael_43598",
                    "telephone" : "677584934576"
                }
            ],
            "partnersNot": [],
            "individualsNot": [{
                "_id" : "YcSipKshuq4tLFSaF",
                "name" : "Stuart Campbell",
                "alias" : "stuart-campbell",
                "owner" : [ 
                    "SRy76ccSYLZQ4TjJZ"
                ],
                "logo" : "assets/images/pictures/stuart.jpg",
                "flagged" : false,
                "bio" : "",
                "position" : "Director and CEO",
                "linkedIn" : "",
                "skype" : "",
                "telephone" : ""
            }]
        }
];
const initialProjectMinimal = [
    {
        "_id": "Pop9ZC8FNvNDRPbNs",
        "alias": "red-alert",
        "flagged" : false,
        "owner": ["SRy76ccSYLZQ4TjJZ"],
        "name": "RED ALERT",
        "domain": "https://redalertproject.eu/",
        "bio": "Online Terrorist Content based on Natural Language Processing, Social Network Analysis, Artificial Intelligence and Complex Event Processing ",
        "logo": "assets/images/logos/red-alert.png",
    }

];
const initialIndividuals = [
    {
        "_id" : "XNoe6aMeJSshimJ4h",
        "alias" : "michael-laubscher",
        "name" : "Michael Laubscher",
        "owner" : [ 
            "SRy76ccSYLZQ4TjJZ"
        ],
        "flagged" : false,
        "logo" : "assets/images/pictures/Michael-ice.jpeg",
        "bio" : "A placement student",
        "position" : "Junior Developer",
        "linkedIn" : "linkedinname",
        "skype" : "live:michael_43598",
        "telephone" : "677584934576",
        "projectsNot" : [ 
        ],
        "partnersNot" : [ 
        ],
        "projects" : [            {
            "_id" : "Pop9ZC8FNvNDRPbNs",
            "alias" : "red-alert",
            "owner" : [ 
                "SRy76ccSYLZQ4TjJZ"
            ],
            "name" : "RED ALERT",
            "flagged" : false,
            "domain" : "https://redalertproject.eu/",
            "bio" : "Online Terrorist Content based on Natural Language Processing, Social Network Analysis, Artificial Intelligence and Complex Event Processing ",
            "logo" : "assets/images/logos/red-alert.png"
        }],
        "partners" : [ 
            {
                "_id" : "SRy76ccSYLZQ4TjJZ",
                "name" : "INFORMATION CATALYST",
                "alias" : "information-catalyst",
                "logo": 'assets/images/logos/ice-infomation-catalyst-logo.jpg',
                "owner" : [ 
                    "SRy76ccSYLZQ4TjJZ"
                ],
                "flagged" : false,
                "domain" : "http://informationcatalyst.com/",
                "bio" : "ICE is a specialist consultancy assisting partners improve their business activities through cutting edge research and innovation, custom software development, and commercial consultancy services. ICE specialises in handling and processing of data, coming from heterogeneous sources in multiple formats and different domains. Our specialised solutions enable enterprises to remain competitive in a rapidly evolving domains."
            }
        ]
    },
    {
        "_id": "YcSipKshuq4tLFSaF",
        "name": "Stuart Campbell",
        "alias" : "stuart-campbell",
        "owner": ["SRy76ccSYLZQ4TjJZ"],
        "logo": "assets/images/pictures/stuart.jpg",
        "flagged" : false,
        "bio": "",
        "position": "Director and CEO",
        "linkedIn": "",
        "skype": "",
        "telephone": "",
        "projectsNot": [],
        "partnersNot": [],
        "projects": [{
            "_id": "Pop9ZC8FNvNDRPbNs",
            "alias": "red-alert",
            "owner": ["SRy76ccSYLZQ4TjJZ"],
            "name": "RED ALERT",
            "flagged" : false,

            "domain": "https://redalertproject.eu/",
            "bio": "Online Terrorist Content based on Natural Language Processing, Social Network Analysis, Artificial Intelligence and Complex Event Processing ",
            "logo": "assets/images/logos/red-alert.png"
        }],
        "partners": [
            {
                "_id" : "SRy76ccSYLZQ4TjJZ",
                "name" : "INFORMATION CATALYST",
                "alias" : "information-catalyst",
                "logo": 'assets/images/logos/ice-infomation-catalyst-logo.jpg',
                "owner" : [ 
                    "SRy76ccSYLZQ4TjJZ"
                ],
                "flagged" : false,
                "domain" : "http://informationcatalyst.com/",
                "bio" : "ICE is a specialist consultancy assisting partners improve their business activities through cutting edge research and innovation, custom software development, and commercial consultancy services. ICE specialises in handling and processing of data, coming from heterogeneous sources in multiple formats and different domains. Our specialised solutions enable enterprises to remain competitive in a rapidly evolving domains.",
                "twitter" : "",
                "linkedin" : ""
            }
    ]
    }
];
const initialIndividualsMinimal = [
    {
        "_id" : "XNoe6aMeJSshimJ4h",
        "alias" : "michael-laubscher",
        "name" : "Michael Laubscher",
        "owner" : [ 
            "SRy76ccSYLZQ4TjJZ"
        ],
        "flagged" : false,
        "logo" : "assets/images/pictures/Michael-ice.jpeg",
        "bio" : "A placement student",
        "position" : "Junior Developer",
        "linkedIn" : "linkedinname",
        "skype" : "live:michael_43598",
        "telephone" : "677584934576",
        
    },
    {
        "_id": "YcSipKshuq4tLFSaF",
        "name": "Stuart Campbell",
        "alias" : "stuart-campbell",
        "owner": ["SRy76ccSYLZQ4TjJZ"],
        "logo": "assets/images/pictures/stuart.jpg",
        "flagged" : false,
        "bio": "",
        "position": "Director and CEO",
        "linkedIn": "",
        "skype": "",
        "telephone": "",
    }
];
const initialPartners = [
    // {
    //   name: 'SIVECO ROMANIA SA',
    //   alias: 'siveco-romania-sa',
    //   logo: 'siveco-romania-sa.png'
    // },
    // {
    //   name: 'USATGES BCN 21 SL',
    //   alias: 'usatges-bcn-21-sl',
    //   logo: 'usatges-bcn-21-sl.png'
    // },
    // {
    //   name: 'INTU-VIEW LTD',
    //   alias: 'intu-view-ltd',
    //   logo: 'intu-view-ltd.png'
    // },
    // {
    //   name: 'MAVEN SEVEN SOLUTIONS ZARTKORUEN MUKODO RESZVENYTARSASAG',
    //   alias: 'maven-seven-solutions-zartkoruen-mukodo-reszvenytarsasag',
    //   logo: 'maven-seven-solutions-zartkoruen-mukodo-reszvenytarsasag.png'
    // },
    // {
    //   name: 'MALTA INFORMATION TECHNOLOGY LAW ASSOCIATION',
    //   alias: 'malta-information-technology-law-association',
    //   logo: 'malta-information-technology-law-association.png'
    // },
    // {
    //   name: 'INTERDISCIPLINARY CENTER (IDC) HERZLIYA',
    //   alias: 'interdisciplinary-center-herzliya',
    //   logo: 'interdisciplinary-center-herzliya.png'
    // },  
    // {
    //   name: 'EOTVOS LORAND TUDOMANYEGYETEM',
    //   alias: 'eotvos-lorand-tudomanyedyetem',
    //   logo: 'eotvos-lorand-tudomanyedyetem.png'
    // },
    // {
    //   name: 'CITY UNIVERSITY OF LONDON',
    //   alias: 'city-university-of-london',
    //   logo: 'city-university-of-london.png'
    // },
    // {
    //   name: 'BIRMINGHAM CITY UNIVERSITY',
    //   alias: 'birmingham-city-university',
    //   logo: 'birmingham-city-university.png'
    // },
    // {
    //   name: 'MAYOR\'S OFFICE FOR POLICINGAND CRIME',
    //   alias: 'mayors-office-for-policingang-crime',
    //   logo: 'mayors-office-for-policingang-crime.png'
    // },
    // {
    //   name: 'MINISTERE DE L\'INTERIEUR',
    //   alias: 'ministere-de-linterieur',
    //   logo: 'ministere-de-linterieur.png'
    // },
    // {
    //   name: 'SERVICIUL DE PROTECTIE SI PAZA',
    //   alias: 'serviciul-de-protectie-si-paza',
    //   logo: 'serviciul-de-protectie-si-paza.png'
    // },
    //  {
    //    name: 'MINISTRY OF PUBLIC SECURITY',
    //    alias: 'ministry-of-public-security',
    //    logo: 'ministry-of-public-security.png',
    //            owner: ["temp"]

    //  },
    //  {
    //    name: 'MINISTERIO DEL INTERIOR',
    //    alias: 'ministerio-del-interior',
    //    logo: 'ministerio-del-interior.png',
    //            owner: ["temp"]

    //  },
    //  {
    //    name: 'SERVICIUL DE PROTECTIE SI PAZA DE STAT',
    //    alias: 'serviciul-de-protectie-si-paza-de-stat',
    //    logo: 'serviciul-de-protectie-si-paza-de-stat.png',
    //            owner: ["temp"]

    //  },
    {
        "_id": "SRy76ccSYLZQ4TjJZ",
        "name": 'INFORMATION CATALYST',
        "alias": 'information-catalyst',
        "logo": 'assets/images/logos/ice-infomation-catalyst-logo.jpg',
        "owner": ["SRy76ccSYLZQ4TjJZ"],
        "flagged" : false,

        "domain": "http://informationcatalyst.com/",
        "bio": "ICE is a specialist consultancy assisting partners improve their business activities through cutting edge research and innovation, custom software development, and commercial consultancy services. ICE specialises in handling and processing of data, coming from heterogeneous sources in multiple formats and different domains. Our specialised solutions enable enterprises to remain competitive in a rapidly evolving domains.",
        "individuals": [{
            "_id" : "YcSipKshuq4tLFSaF",
            "name" : "Stuart Campbell",
            "alias" : "stuart-campbell",
            "owner" : [ 
                "SRy76ccSYLZQ4TjJZ"
            ],
            "logo" : "assets/images/pictures/stuart.jpg",
            "flagged" : false,
            "bio" : "",
            "position" : "Director and CEO",
            "linkedIn" : "",
            "skype" : "",
            "telephone" : ""
        }, {
            "_id" : "XNoe6aMeJSshimJ4h",
            "alias" : "michael-laubscher",
            "name" : "Michael Laubscher",
            "owner" : [ 
                "SRy76ccSYLZQ4TjJZ"
            ],
            "flagged" : false,
            "logo" : "assets/images/pictures/Michael-ice.jpeg",
            "bio" : "A placement student",
            "position" : "Junior Developer",
            "linkedIn" : "linkedinname",
            "skype" : "live:michael_43598",
            "telephone" : "677584934576"
        },],
        "projects": [{
            "_id": "Pop9ZC8FNvNDRPbNs",
            "alias": "red-alert",
            "owner": ["SRy76ccSYLZQ4TjJZ"],
            "name": "RED ALERT",
            "flagged" : false,

            "domain": "https://redalertproject.eu/",
            "bio": "Online Terrorist Content based on Natural Language Processing, Social Network Analysis, Artificial Intelligence and Complex Event Processing ",
            "logo": "assets/images/logos/red-alert.png"
        }],
        "individualsNot": [],
        "projectsNot": []
    }
];
const initialPartnersMinimal = [
    {
        "_id" : "SRy76ccSYLZQ4TjJZ",
        "name" : "INFORMATION CATALYST",
        "alias" : "information-catalyst",
        "logo": 'assets/images/logos/ice-infomation-catalyst-logo.jpg',
        "owner" : [ 
            "SRy76ccSYLZQ4TjJZ"
        ],
        "flagged" : false,
        "domain" : "http://informationcatalyst.com/",
        "bio" : "ICE is a specialist consultancy assisting partners improve their business activities through cutting edge research and innovation, custom software development, and commercial consultancy services. ICE specialises in handling and processing of data, coming from heterogeneous sources in multiple formats and different domains. Our specialised solutions enable enterprises to remain competitive in a rapidly evolving domains."
    }
];
initialUser.forEach(function addUserToCollection(User) {
    const existentUsers = Users.findOne({ alias: User.alias });
    if (!existentUsers) {
        Users.insert(User);
    }
});
initialProject.forEach(function addProjectsToCollection(projects) {
    const existentProjects = Projects.findOne({ alias: projects.alias });
    if (!existentProjects) {
        Projects.insert(projects);
    }
});
initialProjectMinimal.forEach(function addProjectsToCollection(projects) {
    const existentProjects = ProjectsMinimal.findOne({ alias: projects.alias });
    if (!existentProjects) {
        ProjectsMinimal.insert(projects);
    }
});
initialIndividuals.forEach(function addIndividualsToCollection(individual) {
    const existentIndividuals = Individuals.findOne({ alias: individual.alias });
    if (!existentIndividuals) {
        Individuals.insert(individual);
    }
});
initialIndividualsMinimal.forEach(function addIndividualsToCollection(individual) {
    const existentIndividuals = IndividualsMinimal.findOne({ alias: individual.alias });
    if (!existentIndividuals) {
        IndividualsMinimal.insert(individual);
    }
});
initialPartners.forEach(function addPartnerToCollection(partner) {
    const existentPartner = Partners.findOne({ alias: partner.alias });
    if (!existentPartner) {
        Partners.insert(partner);
    }
});
initialPartnersMinimal.forEach(function addPartnerToCollection(partner) {
    const existentPartner = PartnersMinimal.findOne({ alias: partner.alias });
    if (!existentPartner) {
        PartnersMinimal.insert(partner);
    }
});

