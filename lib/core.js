CJC = window.CJC || {};

(function(CJC) {

// Приватные методы

// Нанесение урона юнита другому юниту, рассчитывается сигнатура атакующего
// и обороняющегося
function battleDamage(from, to, damage) {
  if (from.signatureAttack < to.signatureHealth) {
    // Если сигнатура атакующего меньше чем сигнатура брони защищающегося, то идёт 100% урона
    return damage;
  }
  else {
    damage = damage * (to.signatureHealth / from.signatureAttack);
  }
  return damage;
}

// Для "переноса" урона нам необходимо обратное преобразование урона
function battleDamageReverse(from, to, damage) {
  if (from.signatureAttack < to.signatureHealth) {
    // Если сигнатура атакующего меньше чем сигнатура брони защищающегося, то идёт 100% урона
    return damage;
  }
  else {
    damage = damage * (from.signatureAttack / to.signatureHealth);
  }
  return damage;
}

// Проверка умерли ли все юниты в отряде
function checkDefeated(hash) {
  var defeated = true;
  for(var key in hash) {
    if(hash[key].count > 0) {
      defeated = false;
      break;
    }
  }

  return defeated;
}

// Возвращает только живые юниты в отряде
function aliveTroops(hash) {
  var _troops = {};
  for(var key in hash) {
    if (hash[key].count > 0 && !hash[key].is_dead) {
      _troops[key] = hash[key];
    }
  }
  return _troops;
}

// Получение общего здоровья кораблей
function overallHP(troop) {
  if (troop.count > 1) {
    return (troop.count - 1) * troop.hp_full + troop.hp_current;
  }
  else {
    return troop.hp_current;
  }
}

// Функция "наносит" урон юниту.
// Если у юнита здоровья меньше чем получаемый урон, то происходит "перенос урона"
// @return лишний урон
function applyDamage(troop, damage) {
  if (troop.is_dead) {
    return damage;
  }
  var _overall_hp = overallHP(troop);
  troop.damage += damage;

  if (_overall_hp < troop.damage) {
    // Общее HP кораблей меньше чем наносимый урон, производим "перенос урона"
    var diff = troop.damage - _overall_hp;
    troop.damage = _overall_hp;
    troop.is_dead = true;

    return diff;
  }
  return 0;
}

function fireUnits(attackers, attackersData, defenders, defendersData, maxDamage) {
  for (var key in attackers) {
    var _ship_data = attackersData[key];
    if (attackers[key].count <= 0) {
      continue; // Юнит мёртв, делать нечего
    }

    // Высчитываем общий урон, который нанесёт этот юнит
    if (maxDamage) {
      // Вариант для рептилий, максимальный урон
      _ship_data.__damage = attackers[key].count * _ship_data.maxAttack;
    }
    else {
      // Вариант для людей, минимальный урон, т.к. калькулятор рассчитывает
      // наихудший вариант
      _ship_data.__damage = attackers[key].count * (attackers[key].attack || _ship_data.minAttack);
    }

    _ship_data.__damage_transfer = 0;
  }

  // Сперва приоритетные цели
  for (var key in attackers) {
    var _ship_data = attackersData[key];
    if (_ship_data.priorities && _ship_data.priorities.length > 0) {
      // копия общего урона нужна для правильного подсчёта процентов
      var damage_total = _ship_data.__damage;
      // Приоритетные цели
      for (var i = 0; i < _ship_data.priorities.length; i++) {
        // Если приоритетной цели нет в списке или она мертва, пропускаем
        if (!defenders[_ship_data.priorities[i]] || 
             defenders[_ship_data.priorities[i]].is_dead) continue;

        // Приоритетная цель есть в списке, получаем данные по кораблю
        var _defender_data = defendersData[_ship_data.priorities[i]];
        // урон по приоритетным целям: 40% для первой, 30% для второй, 20% для третьей.
        var d = damage_total * CJC.data.battle.percent[i];

        // Этот "приоритетный" урон отнимается от основного
        _ship_data.__damage -= d;

        // Применяем логику "сигнатур" для урона
        d = battleDamage(_ship_data, _defender_data, d);

        // Добавляем этот урон к кораблю рептилий
        var damage_transfer = applyDamage(defenders[_ship_data.priorities[i]], d);
        if (damage_transfer > 0) {
          // Перенос урона, обратный перевод
          _ship_data.__damage_transfer += battleDamageReverse(_ship_data, _defender_data, damage_transfer);
        }

      }
    }
  }

  // Распределяем дополнительный урон
  for (var key in attackers) {
    var _ship_data = attackersData[key];
    // Оставшийся урон после приоритетных атак распределяем равномерно
    // среди живых противников
    var alive_defenders = aliveTroops(defenders);
    var overall_defenders = Object.keys(alive_defenders).length;
    for (var key in alive_defenders) {
      var damage_portion = _ship_data.__damage / overall_defenders;

      _ship_data.__damage -= damage_portion;

      var _defender_data = defendersData[key];

      var d = battleDamage(_ship_data, _defender_data, damage_portion);

      var damage_transfer = applyDamage(defenders[key], d);
      if (damage_transfer > 0) {
        // Перенос урона дальше, обратный перевод
        _ship_data.__damage_transfer += battleDamageReverse(_ship_data, _defender_data, damage_transfer);
      }

      overall_defenders -= 1;
    }
  }

  // Распределяем урон, который должен перенестись на живых противников
  for (var key in attackers) {
    var _ship_data = attackersData[key];
    if (_ship_data.__damage_transfer > 0) {
      // Оставшийся урон после приоритетных атак распределяем равномерно
      // среди живых противников
      var alive_defenders = aliveTroops(defenders);
      var overall_defenders = Object.keys(alive_defenders).length;
      for (var key in alive_defenders) {
        var damage_portion = _ship_data.__damage_transfer / overall_defenders;

        _ship_data.__damage_transfer -= damage_portion;

        var _defender_data = defendersData[key];

        var d = battleDamage(_ship_data, _defender_data, damage_portion);

        var damage_transfer = applyDamage(defenders[key], d);
        if (damage_transfer > 0) {
          // Перенос урона дальше, обратный перевод
          _ship_data.__damage_transfer += battleDamageReverse(_ship_data, _defender_data, damage_transfer);
        }

        overall_defenders -= 1;
      }
    }
  }
}

function destroyUnits(units) {
  for (var key in units) {
    if (units[key].damage > 0) {
      if (units[key].hp_current < units[key].hp_full) {
        // Есть раненый юнит, добиваем его
        units[key].damage -= units[key].hp_current;
        units[key].hp_current = units[key].hp_full;
        units[key].count -= 1;
      }

      var killed = Math.floor(units[key].damage / units[key].hp_full);
      units[key].count -= killed;

      units[key].damage -= killed * units[key].hp_full;

      // Отнимаем оставшийся урон, юнит ранен
      units[key].hp_current -= units[key].damage;

      if (units[key].hp_current < 1) {
        // Чтобы устранить глитч яваскрипта с операциями с плавающей запятой когда
        // например оставшееся здоровье 0.0000000000000000001
        units[key].count -= 1;
        if (units[key].count > 0) {
          units[key].hp_current = units[key].hp_full;
        }
      }
    }
  }
}

// Один раунд боя
function battleRound(humans, reptiles) {
  var logData = {
    humans: {},
    reptiles: {}
  };

  // Обнуляем урон для людей и рептилий с предыдущих раундов
  for (var key in humans) {
    humans[key].damage = 0;
  }
  for (var key in reptiles) {
    reptiles[key].damage = 0;
  }

  // Стреляют люди
  fireUnits(humans, CJC.data.humans, reptiles, CJC.data.reptiles, false);

  // Стреляют рептилии, практически всё то же самое что и у людей
  fireUnits(reptiles, CJC.data.reptiles, humans, CJC.data.humans, true);

  // Сохраняем в лог данные по урону
  for (var key in humans) {
    logData['humans'][key] = {
      damageTaken: humans[key].damage
    }
  }

  for (var key in reptiles) {
    logData['reptiles'][key] = {
      damage: reptiles[key].damage
    }
  }

  // Отнимаем убитое количество у людей
  destroyUnits(humans);

  // Отнимаем убитое количество у рептилий
  destroyUnits(reptiles);

  // Сохраняем в лог данные по оставшемуся здоровью и количеству
  for (var key in humans) {
    logData['humans'][key]['hp'] = humans[key].count == 0? 0: overallHP(humans[key]);
    logData['humans'][key]['count'] = humans[key].count;
    logData['humans'][key]['inflictsDamage'] = humans[key].count * humans[key].attack;

  }

  for (var key in reptiles) {
    logData['reptiles'][key]['hp'] = reptiles[key].count == 0? 0: overallHP(reptiles[key]);
    logData['reptiles'][key]['count'] = reptiles[key].count;
    logData['reptiles'][key]['inflictsDamage'] = reptiles[key].count * CJC.data.reptiles[key].maxAttack;
  }

  return logData;
}

function getAugmentations(unit_id, config) {
  // Базовые значения
  var baseHP = CJC.data.humans[unit_id].health;
  var baseAttack = CJC.data.humans[unit_id].minAttack;

  // Усиления флагмана, ачивки
  if (unit_id == 'flagship') {
    if (config.pirateRaid) {
      baseAttack = baseAttack + 20000;
    }
    if (config.braveCaptain) {
      baseAttack = baseAttack + 30000;
    }
    if (config.headlessAdmiral) {
      baseAttack = baseAttack + 50000;
    }

    // Ачивка "убийца репликонов", +50000 к броне флагмана
    if (config.lepreconKiller) {
      baseHP = baseHP + 50000;
    }
  }

  // Основные проценты, улучшение юнита
  var percentHP = config.upgrades[unit_id] * 0.4;
  var percentAttack = config.upgrades[unit_id] * 0.4;

  // Добавляем бонусы палаты на броню (игра престолов + аватар джона сноу)
  if (config.bonusItemsHP > 0) {
    percentHP += config.bonusItemsHP + config.bonusItemsHP * config.energyLvl / 100;
  }

  // Бонусы палаты на урон (тронный зал жестокости)
  if (config.bonusItemsAttack > 0) {
    percentAttack += config.bonusItemsAttack + config.bonusItemsAttack * config.energyLvl / 100;
  }

  // Хладнокровных хладнокровно, +5% брони
  if (config.coldbloodedCalmly) {
    percentHP += 5;
  }


  // Служитель сатаны, +1% урона
  if (config.satanMinister) {
    percentAttack += 1;
  }

  if (unit_id == 'flagship') {
    percentAttack += config.doomDayCalibrationLvl;
    // Ачивка "несущий свет", +2% урона флагману
    if (config.lightBringer) {
      percentAttack += 2;
    }

    // Ачивка "Лев толстой", +10% урона флагману
    if (config.levTolstoy) {
      percentAttack += 10;
    }
  }

  baseHP = baseHP + baseHP * percentHP / 100;
  baseAttack = baseAttack + baseAttack * percentAttack / 100;

  // Дополнительные проценты, "Совет ебанулся": 20% брони, 15% урона
  if (config.crazyDonateBonus) {
    baseHP = baseHP + baseHP / 5;
    baseAttack = baseAttack + baseAttack * 15 / 100;
  }

  return {attack: Math.floor(baseAttack), health: Math.floor(baseHP)};
}

// Публичные методы
jQuery.extend(CJC, {
  // Главная функция расчёта боя
  calculateBattle: function(humans, reptiles) {
    var config = CJC.getConfig();
    var results = {log: [], rounds: 0};

    // Начальные силы
    var begin_count = 0;
    // Проставляем полное здоровье людям
    for(var key in humans) {
      var count = humans[key];
      var augmentations = getAugmentations(key, config);
      humans[key] = {
        count: count,
        damage: 0,
        dead: false,
        attack: augmentations.attack,
        hp_full:  augmentations.health,//CJC.data.humans[key].health,
        hp_current: augmentations.health,//CJC.data.humans[key].health
      }

      begin_count = begin_count + count;
    }

    // Проставляем полное здоровье рептилиям
    for(var key in reptiles) {
      var count = reptiles[key];
      reptiles[key] = {
        count: count,
        damage: 0,
        dead: false,
        hp_full: CJC.data.reptiles[key].health,
        hp_current: CJC.data.reptiles[key].health
      }
    }

    var logRecord = {humans: {}, reptiles: {}};
    // Записываем в лог начало боя
    for (var key in humans) {
      logRecord['humans'][key] = {
        damageTaken: 0,
        hp: overallHP(humans[key]),
        count: humans[key].count,
        inflictsDamage: humans[key].count * humans[key].attack
      }
    }

    for (var key in reptiles) {
      logRecord['reptiles'][key] = {
        damage: reptiles[key].damage,
        hp: overallHP(reptiles[key]),
        count: reptiles[key].count,
        inflictsDamage: reptiles[key].count * CJC.data.reptiles[key].maxAttack
      }
    }

    results.log.push(logRecord);

    // Начинаем гонять раунды
    while(true) {
      results.log.push(battleRound(humans, reptiles));

      if (checkDefeated(humans)) {
        results['won'] = 'reptiles';
        break;
      }
      else if (checkDefeated(reptiles)) {
        results['won'] = 'humans';
        break;
      }
      results.rounds++;

      if (results.rounds > 20) {
        // Такого по идее быть не должно, вероятно баг
        results['won'] = 'draw';
        break;
      }
    }

    // Силы после боя
    var ending_count = 0;
    for (var key in humans) {
      ending_count += humans[key].count;
    }

    results['losses'] = begin_count - ending_count;

    return results;
  },

  // Получение конфига из базы
  getConfig: function() {
    if (!localStorage['CJC']) {
      var config = {
        crazyDonateBonus: false,
        //achievements
        satanMinister: false,
        pirateRaid: false,
        braveCaptain: false,
        headlessAdmiral: false,
        lepreconKiller: false,
        coldbloodedCalmly: false,
        lightBringer: false,
        levTolstoy: false,
        //research
        energyLvl: 0,
        //alloyLvl: 0,
        //scienceLvl: 0,
        //ikeaLvl: 0,
        //defenseEngineeringLvl: 0,
        //hyperdriveLvl: 0,
        //nanotechnologyLvl: 0,
        //plasmoidConverterLvl: 0,
        doomDayCalibrationLvl: 0,
        //building residential
        //spacePortLvl: 0,
        //entertainmentCenterLvl: 0,
        //blackMarketLvl: 0,
        //building military
        //barracksLvl: 0,
        //militaryFactoryLvl: 0,
        //airfieldLvl: 0,
        //shipyyardLvl: 0,
        //defenseComplexLvl: 0,
        //gatesLvl: 0,
        //engineeringComplexLvl: 0,
        //oscdFabricLvl: 0,
        //room
        bonusItemsAttack: 0.0,
        bonusItemsHP: 0.0,
        //general damage
        //humanDamagePercent: 0.0,
        //reptileDamagePercent: 0.0,
        //targetChangeModifierCoefficient: 1.0,
        //custom
        //attackUnitCustomPercent: 0.0,
        //healthUnitCustomPercent: 0.0,
        //attackDefenceCustomPercent: 0.0,
        //healthDefenceCustomPercent: 0.0,

        upgrades: {
          gammadrone: 0,
          wasp: 0,
          mirage: 0,
          frigate: 0,
          truckc: 0,
          cruiser: 0,
          battleship: 0,
          carrier: 0,
          dreadnought: 0,
          railgun: 0,
          reaper: 0,
          flagship: 0
        }
      }
    }
    else {
      var config = JSON.parse(localStorage['CJC']);
    }

    return config;
  },

  // Сохранение конфига
  setConfig: function(config) {
    localStorage['CJC'] = JSON.stringify(config);
  },

  // Метод для вызова приватных функций, для тестов
  __call: function(func, args) {
    var _func;
    eval("_func=" + func);
    return _func.apply(this, args);
  }

});

})(window.CJC);