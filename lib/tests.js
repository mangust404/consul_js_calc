/**
 * Тест приватных методов
 */
QUnit.test( "battleDamage", function( assert ) {
  var drone = CJC.data.humans.gammadrone;
  drone.signatureAttack = 8;
  drone.signatureHealth = 8;

  var blade = CJC.data.reptiles.blade;
  blade.signatureAttack = 25;
  blade.signatureHealth = 55;

  assert.equal( CJC.__call('battleDamage', [drone, blade, 10]), 10, "Passed!" );

  assert.equal( CJC.__call('battleDamage', [blade, drone, 10]), 3.2, "Passed!" );
});

QUnit.test( "battleDamageReverse", function( assert ) {
  var drone = CJC.data.humans.gammadrone;
  drone.signatureAttack = 8;
  drone.signatureHealth = 8;

  var blade = CJC.data.reptiles.blade;
  blade.signatureAttack = 25;
  blade.signatureHealth = 55;

  assert.equal( CJC.__call('battleDamageReverse', [drone, blade, 10]), 10, "Passed!" );

  assert.equal( CJC.__call('battleDamageReverse', [blade, drone, 3.2]), 10, "Passed!" );
});

QUnit.test( "checkDefeated", function( assert ) {
  var troops1 = {
    gammadrone: {
      count: 0
    },
    wasp: {
      count: 1
    }
  }

  var troops2 = {
    gammadrone: {
      count: 0
    },
    wasp: {
      count: 0
    }
  }

  assert.notOk( CJC.__call('checkDefeated', [troops1]), "Passed!" );
  assert.ok( CJC.__call('checkDefeated', [troops2]), "Passed!" );
});

QUnit.test( "aliveTroops", function( assert ) {
  var troops1 = {
    gammadrone: {
      count: 0
    },
    wasp: {
      count: 1
    }
  }

  var troops2 = {
    gammadrone: {
      count: 0
    },
    wasp: {
      count: 0
    }
  }

  var troops3 = {
    gammadrone: {
      count: 1
    },
    wasp: {
      count: 1
    }
  }

  assert.equal( Object.keys(CJC.__call('aliveTroops', [troops1])).length, 1, "Passed!" );
  assert.equal( Object.keys(CJC.__call('aliveTroops', [troops2])).length, 0, "Passed!" );
  assert.equal( Object.keys(CJC.__call('aliveTroops', [troops3])).length, 2, "Passed!" );
});


QUnit.test( "overallHP", function( assert ) {
  var troop1 = {
    count: 10,
    hp_full: 8,
    hp_current: 8
  }

  var troop2 = {
    count: 10,
    hp_full: 8,
    hp_current: 2
  }

  assert.equal( CJC.__call('overallHP', [troop1]), 80, "Passed!" );
  assert.equal( CJC.__call('overallHP', [troop2]), 74, "Passed!" );

});

QUnit.test( "applyDamage", function( assert ) {
  var troop1 = {
    count: 10,
    hp_full: 8,
    hp_current: 8,
    damage: 0,
    is_dead: false
  }

  var troop2 = {
    count: 10,
    hp_full: 8,
    hp_current: 8,
    damage: 0,
    is_dead: false
  }

  var troop3 = {
    count: 10,
    hp_full: 8,
    hp_current: 8,
    damage: 0,
    is_dead: false
  }

  var troop4 = {
    count: 10,
    hp_full: 8,
    hp_current: 2,
    damage: 0,
    is_dead: false
  }

  assert.equal( CJC.__call('applyDamage', [troop1, 10]), 0, 
    "Наносим урон меньше чем все юниты могут выдержать" );
  assert.equal( troop1.damage, 10, "Passed!" );

  assert.equal( CJC.__call('applyDamage', [troop1, 10]), 0, 
    "Наносим урон покоцанным юнитам" );
  assert.equal( troop1.damage, 20, "Passed!" );


  assert.equal( CJC.__call('applyDamage', [troop1, 80]), 20, 
    "Добиваем покоцанных юнитов, с излишним уроном" );
  assert.equal( troop1.damage, 80, "урон правильный" );
  assert.ok( troop1.is_dead, "юнит мёртв" );


  assert.equal( CJC.__call('applyDamage', [troop2, 80]), 0, 
    "Наносим урон ровно столько сколько юниты могут выдержать" );
  assert.equal( troop2.damage, 80, "урон правильный" );


  assert.equal( CJC.__call('applyDamage', [troop3, 180]), 100, 
    "Наносим урон больше чем все юниты могут выдержать" );
  assert.equal( troop3.damage, 80, "урон правильный" );


  assert.equal( CJC.__call('applyDamage', [troop4, 180]), 180-74, 
    "Наносим урон больше чем все юниты могут выдержать, юниты \"раненные\", но ещё без урона" );
  assert.equal( troop4.damage, 74, "урон правильный" );

  assert.equal( CJC.__call('applyDamage', [troop4, 180]), 180, 
    "Наносим урон уже мёртвым юнитам" );
  assert.equal( troop4.damage, 74, "урон правильный" );
});

QUnit.test( "battleRound", function( assert ) {
  var humans = {
    gammadrone: {
      original_count: 10,
      count: 10,
      damage: 0,
      dead: false,
      hp_full: 24,
      hp_current: 24
    },
    wasp: {
      original_count: 5,
      count: 5,
      damage: 0,
      dead: false,
      hp_full: 35,
      hp_current: 35
    }
  }

  var reptiles = {
    sphero: {
      original_count: 10,
      count: 10,
      damage: 0,
      dead: false,
      hp_full: 10,
      hp_current: 10
    },
    blade: {
      original_count: 5,
      count: 5,
      damage: 0,
      dead: false,
      hp_full: 48,
      hp_current: 48
    }
  }

  var log1 = CJC.__call('battleRound', [humans, reptiles]);
  //console.log(log1);

  assert.equal(humans.gammadrone.count, 8)
  assert.equal(humans.wasp.count, 4)

  assert.equal(reptiles.sphero.count, 8)
  assert.equal(reptiles.blade.count, 5)

  // Следующий раунд
  var log2 = CJC.__call('battleRound', [humans, reptiles]);
  //console.log(log2);

  assert.equal(humans.gammadrone.count, 6)
  assert.equal(humans.wasp.count, 2)

  assert.equal(reptiles.sphero.count, 7)
  assert.equal(reptiles.blade.count, 5)

  // Следующий раунд
  var log3 = CJC.__call('battleRound', [humans, reptiles]);
  //console.log(log3);

  assert.equal(humans.gammadrone.count, 4)
  assert.equal(humans.wasp.count, 1)

  assert.equal(reptiles.sphero.count, 6)
  assert.equal(reptiles.blade.count, 5)
});

QUnit.test( "battleRound with real battle", function( assert ) {
  // 1 дред, 8 рельс и 3 жима
  var humans = {
    dreadnought: {
      original_count: 1,
      count: 1,
      damage: 0,
      dead: false,
      attack: 223200,
      hp_full: 1488000,
      hp_current: 1488000
    },
    railgun: {
      original_count: 8,
      count: 8,
      damage: 0,
      dead: false,
      attack: 65400,
      hp_full: 156960,
      hp_current: 156960
    },
    reaper: {
      original_count: 3,
      count: 3,
      damage: 0,
      dead: false,
      attack: 699840,
      hp_full: 3240000,
      hp_current: 3240000
    }
  }

  // БФ7
  var _reptile_fleet = CJC.data.reptile_fleets.battle['7'];
  var reptiles = {};
  for(var key in _reptile_fleet) {
    reptiles[key] = {
      original_count: _reptile_fleet[key],
      count: _reptile_fleet[key],
      damage: 0,
      dead: false,
      hp_full: CJC.data.reptiles[key].health,
      hp_current: CJC.data.reptiles[key].health
    }
  }
  console.log(reptiles);

  var log1 = CJC.__call('battleRound', [humans, reptiles]);
  console.log(log1);

  // Следующий раунд
  var log2 = CJC.__call('battleRound', [humans, reptiles]);
  console.log(log2);

  // Следующий раунд
  var log3 = CJC.__call('battleRound', [humans, reptiles]);
  console.log(log3);

  // Следующий раунд
  var log4 = CJC.__call('battleRound', [humans, reptiles]);
  console.log(log4);

  assert.equal(humans.dreadnought.count, 1, 'Дреды живы');
  assert.equal(humans.railgun.count, 8, 'Рельсы живы');
  assert.equal(humans.reaper.count, 3, 'Жимы живы');

  assert.equal(reptiles.sphero.count, 0, 'Сфера мертвы');
  assert.equal(reptiles.lacertian.count, 0, 'Ящеры мертвы');
  assert.equal(reptiles.armadillo.count, 0, 'Броненосцы мертвы');
  assert.equal(reptiles.octopus.count, 0, 'Спруты мертвы');
  assert.equal(reptiles.godzilla.count, 0, 'Годзиллы мертвы');
});
/**
 * Тест публичных методов
 */