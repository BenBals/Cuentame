const locations = [
  {
    name: 'Bogotá',
    description: "- Hauptstadt von Kolumbien",
    vocHelp: 'Hauptstadt - capital',
    lng: -74.075833,
    lat: 4.598056
  },
  {
    name: 'Medellín',
    description: "- Hauptstadt des Departamento Atlántico in Kolumbien \n- zweitgrößte Stadt Kolumbiens \n- Geburtsort von Juanes",
    vocHelp: 'die Geburt - el nacimiento',
    lng: -75.564574,
    lat: 6.253041
  },
  {
    name: 'Barranquilla',
    description: "- Hauptstadt des Departamento Atlántico in Kolumbien \n- viertgrößte Stadt Kolumbiens \n- Geburtsort von Shakira",
    vocHelp: 'die Geburt - el nacimiento',
    lng: -74.797044,
    lat: 10.96421
  },
  {
    name: 'Buenaventura',
    description: "- Lage: auf Insel Cascajal an der Pazifikküste am Fuß der Anden",
    vocHelp: 'die Pazifikküste - la costa del Océano Pacífico \nam Fuß - al pie',
    lng: -77.019721,
    lat: 3.883047
  },
  {
    name: 'Cartagena',
    description: "- liegt südwestlich von Barranquilla \n- Stadt an der Karibikküste Kolumbiens",
    vocHelp: '',
    lng: -75.514167,
    lat: 10.399444
  },
  {
    name: 'Cúcuta',
    description: "- sechstgrößte Stadt Kolumbiens \n- liegt im Nordosten Kolumbiens an der Grenze zu Venezuela \n- Hauptstadt der Provinz Norte de Santander",
    vocHelp: 'die Grenze - la frontera',
    lng: -72.49669,
    lat: 7.889097
  },
  {
    name: 'Cali',
    description: "- liegt im Westen Kolumbiens \n- Hauptstadt der Region Valle de Cauca \n- liegt am Río Cali",
    vocHelp: 'am Ufer der/des...liegen - estar a orillas de...',
    lng: -76.528333,
    lat: 3.457222
  },
  {
    name: 'Ibagué',
    description: "- westlich von Bogotá \n	- Hauptstadt der Region Tolima",
    vocHelp: '',
    lng: -75.233333,
    lat: 4.45 
  },
  {
    name: 'Santa Marta',
    description: "- Stadt im Norden Kolumbiens \n- liegt an der Karibikküste",
    vocHelp: '',
    lng: -74.201667,
    lat: 11.236111
  },
  {
    name: 'Pico Cristóbal Colón',
    description: "- zusammen mit Pico Simón Bolívar höchster Berg Kolumbiens \n- liegt im Gebirge Sierra Nevada de Santa Marta im Norden Kolumbiens",
    vocHelp: '',
    lng: -73.6865,
    lat: 10.838619
  },
  {
    name: 'Pico Simón Bolívar',
    description: "- zusammen mit Pico Cristóbal Colón höchster Berg Kolumbiens \n- liegt im Gebirge Sierra Nevada de Santa Marta im Norden Kolumbiens",
    vocHelp: '',
    lng: -73.713539,
    lat: 10.840639
  },
  {
    name: 'Ciudad Perdida',
    description: "- liegt im Norden Kolumbiens in der Sierra Nevada de Santa Marta \n- neben Machu Picchu eine der größten Städte aus der Zeit vor Christoph Kolumbus",
    vocHelp: '',
    lng: -73.925192,
    lat: 11.037997
  },
  {
    name: 'Leticia',
    description: "- südlichste Stadt Kolumbiens",
    vocHelp: '',
    lng: -69.940278,
    lat: -4.208333
  },
  {
    name: 'Nevado del Ruiz',
    description: "- Vulkan in den Anden \n- liegt westlich von Bogotá",
    vocHelp: 'der Vulkan - el volcán',
    lng: -75.316667,
    lat: 4.883333
  },
  {
    name: 'Galeras',
    description: "- Vulkan in den Anden \n- liegt im Südwesten von Kolumbien",
    vocHelp: '',
    lng: -77.353333,
    lat: 1.221944
  },
  {
    name: 'Florencia',
    description: "- Hauptstadt der Provinz Caquetá \n- liegt im Süden Kolumbiens, am östlichen Fuß der Anden (Kordillieren)",
    vocHelp: '',
    lng: -75.612778,
    lat: 1.613889
  },
  {
    name: 'Malpelo',
    description: "- Insel im Pazifik \n- westlichster Ort Kolumbiens",
    vocHelp: '',
    lng: -81.6075,
    lat: 4.002778
  },
  {
    name: 'Lago de Tota',
    description: "- größter SÜSSWASSERsee Kolumbiens \n- liegt ungefähr in halber Verlängerung Cali -> Bogotá",
    vocHelp: 'das Süßwasser - la agua dulce \nungefähr - más o menos \ndie Verlängerung - el alargamiento',
    lng: -72.92,
    lat: 5.54
  },
  {
    name: 'Acevedo',
    description: "- Quelle des Rio Magdalena (dieser mündet in Barranquilla) \n- liegt im Süden der Anden, südwestlich von Popayán",
    vocHelp: 'die Quelle - la fuente \nmünden in... - desembocar en...',
    lng: -75.612778,
    lat: 1.613889
  },
  {
    name: 'Nevado del Huila',
    description: "- Vulkan in den Anden \n- liegt in der Zentral-Kordillerie in den Anden \n- befindet sich südlicher als Cali",
    vocHelp: 'die Zentral-Kordillerie - la cordillera central',
    lng: -76.033333,
    lat: 2.933333
  },
  {
    name: 'Bucaramanga',
    description: "- Hauptstadt des Departamento Santander in Kolumbien \n- liegt nordöstlich von Bogotá \n- besitzt eine der renommiertesten technischen Universitäten in der Region",
    vocHelp: 'renommiert - prestigioso/-a \n technisch - técnico/-a',
    lng: -73.122742,
    lat: 7.119349
  },
  {
    name: 'Pereira',
    description: "- Stadt, liegt am westlichen Fuß der Zentral-Kordilleren \n- etwa Mittelpunkt des „Goldenen Dreiecks“ Bogotá-Medellín-Cali",
    vocHelp: 'das Gold - el oro \ndas Dreieck - el triángulo',
    lng: -75.695833,
    lat: 4.813056
  },
  {
    name: 'Pasto',
    description: "- Hauptstadt des Departamentos Nariño im Südwesten Kolumbiens \n- liegt am Fuß des Vulkans Galeras",
    vocHelp: '',
    lng: -77.280833,
    lat: 1.213333
  },
  {
    name: 'Manizales',
    description: "- Hauptstadt des Departamento Caldas \n- liegt im Hauptkaffeeanbaugebiet Kolumbiens \n- befindet sich nordöstlich von Pereira",
    vocHelp: 'Haupt-... - principal \ndas Anbaugebiet - el terreno de cultivo',
    lng: -75.517222,
    lat: 5.068889
  },
  {
    name: 'Turbo',
    description: "- Stadt und Gemeinde im Norden Kolumbiens \n- liegt am Golf von Urabá am Karibischen Meer \n- Hafenstadt und Grenzstadt nach Panamá",
    vocHelp: 'die Gemeinde - el municipio \nder Golf - el golfo \ndie Hafenstadt - la ciudad portuaria',
    lng: -76.728056,
    lat: 8.0925
  },
  
]

module.exports.default = locations
