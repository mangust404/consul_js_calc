$(function() {
  function drawBattle(results) {
    console.log(results);
    var id = 'log-' + (new Date).getTime();
    var $item = $('<div role="alert" id="' + id + '"></div>');
    var $verbose = $('<div class="collapse panel panel-default" id="' + id + '-verbose"></div>');
    var $verbose_body = $('<div class="panel-body"></div>');
    $verbose.append($verbose_body);

    switch (results.won) {
      case 'humans':
        if (results.losses > 0) {
          $item.attr('class', 'alert alert-warning');
        }
        else {
          $item.attr('class', 'alert alert-success');
        }
        $item.append('<span><i class="glyphicon glyphicon-ok"></i>&nbsp;Победа</span> ');
      break;
      case 'reptiles':
        $item.attr('class', 'alert alert-danger');
        $item.append('<span><i class="glyphicon glyphicon-remove"></i>&nbsp;Поражение</span> ');
      break;
      case 'draw':
        $item.append('<span><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;Бой затянулся?</span> ');
        $item.attr('class', 'alert alert-info');
      break;
    }

    $item.append('<span>Раундов: ' + (results.rounds + 1) + ', потери: <b>' + results.losses + '</b></span>');
    $item.append('<button data-target="#' + id + '-verbose" class="btn btn-primary pull-right " data-toggle="collapse"><i class="glyphicon glyphicon-plus"></i></button>');

    var $table = $('<table class="table">');
    var $thead = $('<thead>').appendTo($table);
    var $tr = $('<tr>').appendTo($thead);
    $('<th>').appendTo($tr);

    for (var key in results.log[0].humans) {
      $('<th>').html(CJC.data.humans[key].displayName).appendTo($tr);
    }
    for (var key in results.log[0].reptiles) {
      $('<th>').html(CJC.data.reptiles[key].displayName).css({'background-color': '#e7c3c3'}).appendTo($tr);
    }
    var $tbody = $('<tbody>').appendTo($table);
    for(var i = 0; i < results.log.length; i++) {
      var $tr = $tbody.append('<tr>');
      if (i == 0) {
        $('<td>').html('Исходные').appendTo($tr);
      }
      else {
        $('<td>').html('Раунд ' + i).appendTo($tr);
      }

      for (var key in results.log[i].humans) {
        $('<td>').html(results.log[i].humans[key].count + ' <span class="small text-muted">(' + 
                       parseInt(results.log[i].humans[key].hp) + ' hp, ' + 
                       parseInt(results.log[i].humans[key].inflictsDamage) + ' урон)</span>')
                  .appendTo($tr);
      }
      for (var key in results.log[i].reptiles) {
        $('<td>').html(results.log[i].reptiles[key].count + ' <span class="small text-muted">(' + 
                       parseInt(results.log[i].reptiles[key].hp) + ' hp, ' +
                       parseInt(results.log[i].reptiles[key].inflictsDamage) + ' урон)</span>')
                 .appendTo($tr);
      }

    }
    $verbose_body.append($table);

    $('#results').prepend($verbose);
    $('#results').prepend($item);

    $item.on('mouseup', function() {
      $(this).find('button').click();
      return false;
    });
  }

	$('#run_calc').click(function() {
    var humans = {};
    var humans_original = {};
    $('#input-humans input').each(function() {
      var count = parseInt($(this).val());
      if (count > 0) {
        humans[this.id] = count;
        humans_original[this.id] = count;
      }
    });

    var reptiles = {};
    var reptiles_original = {};
    $('#input-reptiles input').each(function() {
      var count = parseInt($(this).val());
      if (count > 0) {
        reptiles[this.id] = count;
        reptiles_original[this.id] = count;
      }
    });

    var battleResults = CJC.calculateBattle(humans, reptiles);

    var recent = (localStorage['CJC_recent']? JSON.parse(localStorage['CJC_recent']): false) || [];
    // удаляем последний элемент
    if (recent.length > 5) {
      recent.pop();
    }

    recent.unshift({
      humans: humans_original,
      reptiles: reptiles_original,
      rounds: battleResults.rounds,
      won: battleResults.won
    });

    localStorage['CJC_recent'] = JSON.stringify(recent);

    drawBattle(battleResults);
  });

  $('#reptiles-fleet, #reptiles-level').on('change', function() {
    if ($('#reptiles-fleet').val() && $('#reptiles-level').val()) {
      // Получаем данные по флоту
      var fleet = CJC.data.reptile_fleets[$('#reptiles-fleet').val()][$('#reptiles-level').val()];
      // Сбрасываем все текущие значения
      $('#input-reptiles input').val(0);

      // Проставляем значения флота
      for (var key in fleet) {
        $('#' + key).val(fleet[key]);
      }
    }
  });
})