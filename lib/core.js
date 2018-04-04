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
    if (hash[key].count > 0) {
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
    if (attackers[key].count <= 0) continue; // Юнит мёртв, делать нечего

    // Высчитываем общий урон, который нанесёт этот юнит
    if (maxDamage) {
      // Вариант для рептилий, максимальный урон
      var damage = attackers[key].count * _ship_data.maxAttack;
    }
    else {
      // Вариант для людей, минимальный урон, т.к. калькулятор рассчитывает
      // наихудший вариант
      var damage = attackers[key].count * (attackers[key].attack || _ship_data.minAttack);
    }
    if (_ship_data.priorities && _ship_data.priorities.length > 0) {
      // Приоритетные цели
      for (var i = 0; i < _ship_data.priorities.length; i++) {
        // Если приоритетной цели нет в списке, пропускаем
        if (!defenders[_ship_data.priorities[i]]) continue;

        // Приоритетная цель есть в списке, получаем данные по кораблю
        var _reptile_data = defendersData[_ship_data.priorities[i]];
        // урон по приоритетным целям: 40% для первой, 30% для второй, 20% для третьей.
        var d = damage * CJC.data.battle.percent[i];
        // Этот "приоритетный" урон отнимается от основного
        damage -= d;

        // Применяем логику "сигнатур" для урона
        d = battleDamage(_ship_data, _reptile_data, d);

        // Добавляем этот урон к кораблю рептилий
        var damage_transfer = applyDamage(defenders[_ship_data.priorities[i]], d);
        if (damage_transfer > 0) {
          // Перенос урона, обратный перевод
          damage += battleDamageReverse(_ship_data, _reptile_data, damage_transfer);
        }
      }
    }

    // Оставшийся урон после приоритетных атак распределяем равномерно
    // среди живых противников
    var alive_defenders = aliveTroops(defenders);
    var overall_defenders = Object.keys(alive_defenders).length;
    for (var key in alive_defenders) {
      var damage_portion = damage / overall_defenders;

      damage -= damage_portion;

      var _reptile_data = defendersData[key];
      var d = battleDamage(_ship_data, _reptile_data, damage_portion);

      var damage_transfer = applyDamage(defenders[key], d);
      if (damage_transfer > 0) {
        // Перенос урона дальше, обратный перевод
        damage += battleDamageReverse(_ship_data, _reptile_data, damage_transfer);
      }

      overall_defenders -= 1;
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
      damage: humans[key].damage
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
    logData['humans'][key]['hp'] = overallHP(humans[key]);
    logData['humans'][key]['count'] = humans[key].count;
  }

  for (var key in reptiles) {
    logData['reptiles'][key]['hp'] = overallHP(reptiles[key]);
    logData['reptiles'][key]['count'] = reptiles[key].count;
  }

  return logData;
}

// Публичные методы
jQuery.extend(CJC, {
  // Главная функция расчёта боя
  calculateBattle: function(humans, reptiles) {
    var config = CJC.getConfig();
    var results = {};

    // Проставляем полное здоровье людям
    for(var key in humans) {
      var count = humans[key];
      humans[key] = {
        original_count: count,
        count: count,
        damage: 0,
        dead: false,
        hp_full: CJC.data.humans[key].health,
        hp_current: CJC.data.humans[key].health
      }
    }

    // Проставляем полное здоровье рептилиям
    for(var key in reptiles) {
      var count = reptiles[key];
      reptiles[key] = {
        original_count: count,
        count: count,
        damage: 0,
        dead: false,
        hp_full: CJC.data.reptiles[key].health,
        hp_current: CJC.data.reptiles[key].health
      }
    }

    // Начинаем гонять раунды
    while(true) {
      battleRound(humans, reptiles);

      if (checkDefeated(humans)) {
        results['won'] = 'humans';
        break;
      }
      else if (checkDefeated(reptiles)) {
        results['won'] = 'reptiles';
        break;
      }

      console.log('humans', humans, 'reptiles', reptiles);
      break;
    }

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
        alloyLvl: 0,
        scienceLvl: 0,
        ikeaLvl: 0,
        defenseEngineeringLvl: 0,
        hyperdriveLvl: 0,
        nanotechnologyLvl: 0,
        plasmoidConverterLvl: 0,
        doomDayCalibrationLvl: 0,
        //building residential
        spacePortLvl: 0,
        entertainmentCenterLvl: 0,
        blackMarketLvl: 0,
        //building military
        barracksLvl: 0,
        militaryFactoryLvl: 0,
        airfieldLvl: 0,
        shipyyardLvl: 0,
        defenseComplexLvl: 0,
        gatesLvl: 0,
        engineeringComplexLvl: 0,
        oscdFabricLvl: 0,
        //room
        bonusItems: 0.0,
        //general damage
        humanDamagePercent: 0.0,
        reptileDamagePercent: 0.0,
        targetChangeModifierCoefficient: 1.0,
        //custom
        attackUnitCustomPercent: 0.0,
        healthUnitCustomPercent: 0.0,
        attackDefenceCustomPercent: 0.0,
        healthDefenceCustomPercent: 0.0
      }
    }
    else {
      var config = JSON.parse(localStorage['CJC']);
    }
  },

  // Сохранение конфига
  setConfig: function(config) {
    localStorage['CJC'] = JSON.stringify(config);
  },

  // Преобразование конфига в улучшения урона и брони
  getConfigAugmentations: function(config) {
    
  },

  // Применение конфига к юнитам (добавление урона и силы)
  applyConfig: function(config, units) {

  },

  // Метод для вызова приватных функций, для тестов
  __call: function(func, args) {
    var _func;
    eval("_func=" + func);
    return _func.apply(this, args);
  }

});

})(window.CJC);