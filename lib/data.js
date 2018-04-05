CJC = window.CJC || {};
CJC.data = CJC.data || {};

var ONE = 1;          //Один
var FEW = 4;          //Несколько
var SEVERAL = 9;      //Немного
var PACK = 19;        //Отряд
var LOTS = 49;        //Толпа
var HORDE = 99;       //Орда
var THRONG = 249;     //Множество
var SWARM = 499;      //Туча
var ZOUNDS = 999;     //Полчище
var LEGION = 4999;   //Легион
var DIVISION = 9999; //Дивизия
var CORPS = 19999;   //Корпус
var ARMY = 44999;    //Армия
var GROUP = 99999;   //Группа Армий
var FRONT = 249999;   //Фронт
var AMOUNT_2 = 2;
var AMOUNT_8 = 8;
var AMOUNT_16 = 16;
var AMOUNT_32 = 32;
var AMOUNT_64 = 64;

jQuery.extend(CJC.data, {
// Основные данные по кораблям
humans: {
  gammadrone: {
    "displayName": "Гаммадрон",
    "shortName": "дрон",
    "health": 24,
    "minAttack": 1,
    "maxAttack": 1,
    "signatureAttack": 8,
    "signatureHealth": 8,
    "power": 0.26,
    "priorities":[
      "wyvern",
      "dragon",
      "hydra"
    ],
    "price": {
      "human": "0",
      "metal": 62,
      "crystal": 16,
      "time": 900
    }
  },
  wasp: {
    "displayName": "Оса",
    "shortName": "оса",
    "health": 35,
    "minAttack": 8,
    "maxAttack": 12,
    "signatureAttack": 10,
    "signatureHealth": 60,
    "power": 0.55,
    "priorities":[
      "sphero",
      "armadillo",
      "wyvern"
    ],
    "price": {
      "human": "5",
      "metal": 75,
      "crystal": 25,
      "time": 1800
    }
  },
  mirage: {
    "displayName": "Мираж",
    "shortName": "мираж",
    "health": 80,
    "minAttack": 18,
    "maxAttack": 22,
    "signatureAttack": 8,
    "signatureHealth": 50,
    "power": 1.2,
    "priorities":[
      "sphero",
      "octopus",
      "wyvern"
    ],
    "price": {
      "human": "5",
      "metal": 180,
      "crystal": 60,
      "time": 3600
    }
  },
  frigate: {
    "displayName": "Фрегат",
    "shortName": "фриг",
    "health": 2200,
    "minAttack": 400,
    "maxAttack": 600,
    "signatureAttack": 40,
    "signatureHealth": 125,
    "power": 32,
    "priorities":[
      "blade",
      "sphero",
      "armadillo"
    ],
    "price": {
      "human": "100",
      "metal": 3500,
      "crystal": 1000,
      "time": 54000
    }
  },
  truckc: {
    "displayName": "Трак С",
    "shortName": "трак",
    "health": 60,
    "minAttack": 10,
    "maxAttack": 20,
    "signatureAttack": 20,
    "signatureHealth": 80,
    "power": 0.9,
    "priorities":[
      "sphero",
      "blade",
      "lacertian"
    ],
    "price": {
      "human": "10",
      "metal": 120,
      "crystal": 30,
      "time": 162000
    }
  },
  cruiser: {
    "displayName": "Крейсер",
    "shortName": "крыс",
    "health": 13000,
    "minAttack": 5400,
    "maxAttack": 6600,
    "signatureAttack": 380,
    "signatureHealth": 13000,
    "power": 250,
    "priorities":[
      "hydra",
      "armadillo",
      "lacertian"
    ],
    "price": {
      "human": "1000",
      "metal": 13000,
      "crystal": 4000,
      "time": 259200
    }
  },
  battleship: {
    "displayName": "Линкор",
    "shortName": "линк",
    "health": 160000,
    "minAttack": 36000,
    "maxAttack": 44000,
    "signatureAttack": 500,
    "signatureHealth": 1000,
    "power": 2400,
    "priorities":[
      "armadillo",
      "hydra",
      "dragon"
    ],
    "price": {
      "human": "5000",
      "metal": 150000,
      "crystal": 30000,
      "time": 518400
    }
  },
  carrier: {
    "displayName": "Авианосец",
    "shortName": "авик",
    "health": 200000,
    "minAttack": 22500,
    "maxAttack": 27500,
    "signatureAttack": 40,
    "signatureHealth": 2000,
    "power": 2500,
    "priorities":[
      "lacertian",
      "blade",
      "wyvern"
    ],
    "price": {
      "human": "10000",
      "metal": 250000,
      "crystal": 45000,
      "time": 1296000
    }
  },
  dreadnought: {
    "displayName": "Дредноут",
    "shortName": "дред",
    "health": 1200000,
    "minAttack": 180000,
    "maxAttack": 220000,
    "signatureAttack": 1000,
    "signatureHealth": 1800,
    "power": 16000,
    "priorities":[
      "armadillo",
      "hydra",
      "dragon"
    ],
    "price": {
      "human": "25000",
      "metal": 450000,
      "crystal": 150000,
      "time": 2592000
    }
  },
  railgun: {
    "displayName": "Рейлган",
    "shortName": "рельса",
    "health": 120000,
    "minAttack": 50000,
    "maxAttack": 70000,
    "signatureAttack": 150,
    "signatureHealth": 40,
    "power": 2400,
    "priorities":[
      "hydra",
      "octopus",
      "prism"
    ],
    "price": {
      "human": "0",
      "metal": 50000,
      "crystal": 200000,
      "time": 1814400
    }
  },
  reaper: {
    "displayName": "Пожинатель",
    "shortName": "жим",
    "health": 2500000,
    "minAttack": 540000,
    "maxAttack": 660000,
    "signatureAttack": 2000,
    "signatureHealth": 5000,
    "power": 37000,
    "priorities":[
      "godzilla",
      "armadillo",
      "octopus"
    ],
    "price": {
      "human": "50000",
      "metal": 850000,
      "crystal": 300000,
      "time": 3628800
    }
  },
  flagship: {
    "displayName": "Флагман",
    "shortName": "флаг",
    "health": 3000000,
    "minAttack": 900000,
    "maxAttack": 1100000,
    "signatureAttack": 10000,
    "signatureHealth": 10000,
    "power": 50000,
    "priorities":[
      "shadow",
      "godzilla",
      "octopus"
    ],
    "price": {
      "human": "150000",
      "metal": 1000000,
      "crystal": 100000,
      "time": 259200
    }
  }
},

// Данные по обороне
defence: {
  bomb: {
    "displayName": "Мины",
    "health": 1,
    "minAttack": 5,
    "maxAttack": 5,
    "signatureAttack": 1,
    "signatureHealth": 1000,
    "power": 0,
    "priorities":[
    ],
    "price": {
      "human": "0",
      "metal": 20,
      "crystal": 0,
      "time": 15
    }
  },
  ionbomb: {
    "displayName": "Ионные Мины",
    "health": 1,
    "minAttack": 10,
    "maxAttack": 10,
    "signatureAttack": 1,
    "signatureHealth": 1000,
    "power": 0,
    "priorities":[
      "sphero",
      "blade",
      "lacertian"
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 3
    }
  },
  turret: {
    "displayName": "Турель",
    "health": 100,
    "minAttack": 12,
    "maxAttack": 16,
    "signatureAttack": 100,
    "signatureHealth": 50,
    "power": 0,
    "priorities":[
      "sphero",
      "blade",
      "lacertian"
    ],
    "price": {
      "human": "0",
      "metal": 60,
      "crystal": 10,
      "time": 180
    }
  },
  laserTurret: {
    "displayName": "Лазерная Турель",
    "health": 200,
    "minAttack": 25,
    "maxAttack": 35,
    "signatureAttack": 90,
    "signatureHealth": 45,
    "power": 0,
    "priorities":[
      "blade",
      "lacertian",
      "wyvern"
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 60
    }
  },
  sniperGun: {
    "displayName": "Снайпер Ган",
    "health": 12000,
    "minAttack": 4000,
    "maxAttack": 6000,
    "signatureAttack": 500,
    "signatureHealth": 1000,
    "power": 0,
    "priorities":[
      "wyvern",
      "dragon",
      "hydra"
    ],
    "price": {
      "human": "0",
      "metal": 4000,
      "crystal": 2000,
      "time": 10800
    }
  },
  railCannon: {
    "displayName": "Рельсовая Пушка",
    "health": 25000,
    "minAttack": 18000,
    "maxAttack": 22000,
    "signatureAttack": 400,
    "signatureHealth": 800,
    "power": 0,
    "priorities":[
      "hydra",
      "dragon",
      "wyvern"
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 5400
    }
  },
  plasmaKiller: {
    "displayName": "Убийца",
    "health": 2000000,
    "minAttack": 80000,
    "maxAttack": 120000,
    "signatureAttack": 2000,
    "signatureHealth": 3000,
    "power": 0,
    "priorities":[
      "dragon",
      "wyvern",
      "lacertian"
    ],
    "price": {
      "human": "0",
      "metal": 140000,
      "crystal": 20000,
      "time": 1296000
    }
  },
  tyrant: {
    "displayName": "Тиран",
    "health": 4000000,
    "minAttack": 360000,
    "maxAttack": 440000,
    "signatureAttack": 1800,
    "signatureHealth": 2500,
    "power": 0,
    "priorities":[
      "armadillo",
      "prism",
      "hydra"
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 270000
    }
  },
  crystalGun: {
    "displayName": "Кристалл-Ган",
    "health": 10000000,
    "minAttack": 720000,
    "maxAttack": 880000,
    "signatureAttack": 6000,
    "signatureHealth": 5000,
    "power": 0,
    "priorities":[
      "godzilla",
      "octopus",
      "prism"
    ],
    "price": {
      "human": "0",
      "metal": 100000,
      "crystal": 300000,
      "time": 5184000
    }
  },
  trilinear: {
    "displayName": "ТКГ",
    "health": 100000000,
    "minAttack": 9000000,
    "maxAttack": 11000000,
    "signatureAttack": 10000,
    "signatureHealth": 20000,
    "power": 0,
    "priorities":[
      "shadow",
      "godzilla",
      "octopus"
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 2592000
    }
  },
  deforbital: {
    "displayName": "OCO",
    "health": 500000000,
    "minAttack": 20000000,
    "maxAttack": 20000000,
    "signatureAttack": 15000,
    "signatureHealth": 100000,
    "power": 0,
    "priorities":[
      "armadillo",
      "shadow",
      "blade"
    ],
    "price": {
      "human": "3000000",
      "metal": 20000000,
      "crystal": 20000000,
      "time": 23328000
    }
  },
  doomsdaygun: {
    "displayName": "ОСД",
    "health": 1,
    "minAttack": 1000000000,
    "maxAttack": 1000000000,
    "signatureAttack": 1,
    "signatureHealth": 1,
    "power": 0,
    "priorities":[
    ],
    "price": {
      "human": "0",
      "metal": 0,
      "crystal": 0,
      "time": 1814400
    }
  }
},

// Данные по рептилиям
reptiles: {
  sphero: {
    "displayName": "Сферо",
    "health": 10,
    "minAttack": 5,
    "maxAttack": 7,
    "signatureAttack": 7,
    "signatureHealth": 6,
    "power": 0.22,
    "priorities": [
      "gammadrone",
      "cruiser",
      "battleship"
    ],
    "price": {
      "human": "",
      "metal": 7,
      "crystal": 3,
      "time": 0
    }
  },
  blade: {
    "displayName": "Клинок",
    "health": 48,
    "minAttack": 13,
    "maxAttack": 17,
    "signatureAttack": 25,
    "signatureHealth": 55,
    "power": 0.78,
    "priorities": [
      "gammadrone",
      "wasp",
      "mirage"
    ],
    "price": {
      "human": "",
      "metal": 10,
      "crystal": 4,
      "time": 0
    }
  },
  lacertian: {
    "displayName": "Ящер",
    "health": 120,
    "minAttack": 34,
    "maxAttack": 42,
    "signatureAttack": 60,
    "signatureHealth": 90,
    "power": 1.96,
    "priorities": [
      "gammadrone",
      "mirage",
      "wasp"
    ],
    "price": {
      "human": "",
      "metal": 19.5,
      "crystal": 8,
      "time": 0
    }
  },
  wyvern: {
    "displayName": "Виверна",
    "health": 2000,
    "minAttack": 1260,
    "maxAttack": 1540,
    "signatureAttack": 120,
    "signatureHealth": 80,
    "power": 48,
    "priorities": [
      "frigate",
      "cruiser",
      "battleship"
    ],
    "price": {
      "human": "",
      "metal": 550,
      "crystal": 150,
      "time": 0
    }
  },
  trioniks: {
    "displayName": "Трионикс",
    "health": 350,
    "minAttack": 10,
    "maxAttack": 10,
    "signatureAttack": 20,
    "signatureHealth": 200,
    "power": 3.7,
    "priorities": [
      "gammadrone",
      "wasp",
      "mirage"
    ],
    "price": {
      "human": "",
      "metal": 0,
      "crystal": 0,
      "time": 0
    }
  },
  dragon: {
    "displayName": "Дракон",
    "health": 16000,
    "minAttack": 6750,
    "maxAttack": 8250,
    "signatureAttack": 420,
    "signatureHealth": 600,
    "power": 310,
    "priorities": [
      "carrier",
      "frigate",
      "gammadrone"
    ],
    "price": {
      "human": "",
      "metal": 1750,
      "crystal": 580,
      "time": 0
    }
  },
  hydra: {
    "displayName": "Гидра",
    "health": 90000,
    "minAttack": 100000,
    "maxAttack": 140000,
    "signatureAttack": 300,
    "signatureHealth": 500,
    "power": 3300,
    "priorities": [
      "gammadrone",
      "carrier",
      "frigate"
    ],
    "price": {
      "human": "",
      "metal": 17000,
      "crystal": 6000,
      "time": 0
    }
  },
  armadillo: {
    "displayName": "Броненосец",
    "health": 1000000,
    "minAttack": 2000,
    "maxAttack": 2000,
    "signatureAttack": 40,
    "signatureHealth": 8000,
    "power": 10040,
    "priorities": [
      "gammadrone",
      "wasp",
      "mirage"
    ],
    "price": {
      "human": "",
      "metal": 26000,
      "crystal": 8000,
      "time": 0
    }
  },
  prism: {
    "displayName": "Призма",
    "health": 1500000,
    "minAttack": 270000,
    "maxAttack": 330000,
    "signatureAttack": 1250,
    "signatureHealth": 1600,
    "power": 21000,
    "priorities": [
      "gammadrone",
      "carrier",
      "battleship"
    ],
    "price": {
      "human": "",
      "metal": 60000,
      "crystal": 20000,
      "time": 0
    }
  },
  octopus: {
    "displayName": "Спрут",
    "health": 1500000,
    "minAttack": 72000,
    "maxAttack": 88000,
    "signatureAttack": 560,
    "signatureHealth": 2200,
    "power": 16600,
    "priorities": [
      "cruiser",
      "frigate",
      "carrier"
    ],
    "price": {
      "human": "",
      "metal": 70000,
      "crystal": 10000,
      "time": 0
    }
  },
  godzilla: {
    "displayName": "Годзила",
    "health": 3000000,
    "minAttack": 1125000,
    "maxAttack": 1375000,
    "signatureAttack": 3000,
    "signatureHealth": 5000,
    "power": 55000,
    "priorities": [
      "flagship",
      "reaper",
      "dreadnought"
    ],
    "price": {
      "human": "",
      "metal": 130000,
      "crystal": 40000,
      "time": 0
    }
  },
  shadow: {
    "displayName": "Тень",
    "health": 10000000,
    "minAttack": 2700000,
    "maxAttack": 3300000,
    "signatureAttack": 6000,
    "signatureHealth": 10000,
    "power": 0,
    "priorities": [
      "flagship",
      "reaper",
      "dreadnought"
    ],
    "price": {
      "human": "",
      "metal": 0,
      "crystal": 0,
      "time": 0
    }
  }
},

reptile_fleets: {
  patrol: {
    shortName: 'П',
    1: {
      sphero: FEW
    },
    2: {
      sphero: SEVERAL,
      blade: FEW
    },
    3: {
      blade: PACK,
      lacertian: FEW
    },
    4: {
      sphero: ZOUNDS
    },
    5: {
      lacertian: SEVERAL,
      dragon: FEW
    },
    6: {
      wyvern: PACK,
      dragon: SEVERAL,
      armadillo: ONE
    },
    7: {
      blade: LOTS,
      octopus: ONE
    }
  },
  defence: {
    shortName: 'РО',
    1: {
      blade: SEVERAL
    },
    2: {
      sphero: PACK,
      blade: SEVERAL,
      lacertian: FEW
    },
    3: {
      sphero: THRONG,
      wyvern: ONE
    },
    4: {
      wyvern: FEW,
      dragon: ONE
    },
    5: {
      dragon: FEW,
      hydra: ONE
    },
    6: {
      lacertian: LOTS,
      armadillo: ONE,
      prism: ONE
    },
    7: {
      hydra: SEVERAL,
      armadillo: ONE,
      godzilla: ONE
    }
  },
  battle: {
    shortName: 'БФ',
    1: {
      lacertian: SEVERAL
    },
    2: {
      lacertian: PACK,
      wyvern: FEW,
    },
    3: {
      blade: THRONG,
      dragon: ONE
    },
    4: {
      sphero: ZOUNDS,
      wyvern: SEVERAL,
      hydra: ONE
    },
    5: {
      blade: PACK,
      dragon: FEW,
      hydra: FEW,
      armadillo: ONE
    },
    6: {
      wyvern: LOTS,
      armadillo: ONE,
      godzilla: ONE
    },
    7: {
      sphero: SWARM,
      lacertian: THRONG,
      armadillo: FEW,
      octopus: ONE,
      godzilla: ONE
    }
  },
  trade: {
    shortName: 'К',
    1: {
      trioniks: ONE
    },
    2: {
      sphero: SEVERAL,
      trioniks: AMOUNT_2
    },
    3: {
      sphero: PACK,
      blade: SEVERAL,
      trioniks: FEW
    },
    4: {
      lacertian: SEVERAL,
      wyvern: FEW,
      trioniks: AMOUNT_8
    },
    5: {
      blade: LOTS,
      dragon: FEW,
      trioniks: AMOUNT_16
    },
    6: {
      sphero: THRONG,
      dragon: SEVERAL,
      armadillo: ONE,
      trioniks: AMOUNT_32
    },
    7: {
      sphero: SWARM,
      armadillo: ONE,
      octopus: ONE,
      trioniks: AMOUNT_64
    }
  }
},

battle: {
  // Распределение урона по приоритетам атаки
  percent: {
    0: 0.4,
    1: 0.3,
    2: 0.2
  }
}

});