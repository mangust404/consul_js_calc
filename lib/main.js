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
        $item.attr('class', 'alert alert-success');
      break;
      case 'reptiles':
        $item.attr('class', 'alert alert-danger');
      break;
      case 'draw':
        $item.attr('class', 'alert alert-warning');
      break;
    }

    $item.append('<label>Раундов: ' + (results.rounds + 1) + '</label>');
    $item.append('<button data-target="#' + id + '-verbose" class="btn btn-primary pull-right " data-toggle="collapse"><i class="glyphicon glyphicon-plus"></i></button>');

    $verbose_body.append('<div>123</div>');

    $('#results').append($item);
    $('#results').append($verbose);
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