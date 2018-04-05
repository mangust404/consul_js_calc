$(function() {
  var is_recent;

  function drawBattle(results) {
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

    var shortText = '';
    for (var key in results.log[0].humans) {
      shortText += CJC.data.humans[key].shortName + ' x ' + results.log[0].humans[key].count + ' ';
    }

    if (results.reptiles_fleet && results.reptiles_level) {
      shortText += 'vs ' + CJC.data.reptile_fleets[results.reptiles_fleet].shortName + results.reptiles_level;
    }
    else {
      shortText += 'vs custom';
    }

    $item.append('<span>Раундов: ' + (results.rounds + 1) + ', потери: <b>' + results.losses + '</b> ' + shortText + '</span>');
    $item.append('<button data-target="#' + id + '-verbose" class="btn btn-primary collapsed pull-right" data-toggle="collapse"><i class="glyphicon glyphicon-plus"></i></button>');

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

  // Отрисовка недавних запросов
  function drawRecent() {
    var recent = (sessionStorage['CJC_recent']? JSON.parse(sessionStorage['CJC_recent']): []);
    $('#recent').html('');

    for (var i = recent.length - 1; i >= 0; i--) {
      var $item = $('<a href="#">');
      var recent_item = recent[i];
      switch (recent_item.won) {
        case 'humans':
          if (recent_item.losses > 0) {
            $item.attr('class', 'alert-warning');
          }
          else {
            $item.attr('class', 'alert-success');
          }
        break;
        case 'reptiles':
          $item.attr('class', 'alert-danger');
        break;
        case 'draw':
          $item.attr('class', 'alert-info');
        break;
      }

      var shortText = '';
      if (recent_item.reptiles_fleet && recent_item.reptiles_level) {
        shortText += 'vs ' + CJC.data.reptile_fleets[recent_item.reptiles_fleet].shortName + recent_item.reptiles_level;
      }
      else {
        shortText += 'vs custom';
      }

      if (recent_item.losses > 0) {
        shortText += ' потери: ' + recent_item.losses;
      }

      $item.html(shortText);
      $item[0]._data = recent[i];

      $item.on('click', function() {
        console.log(this._data);
        is_recent = true;
        $('#input-humans input').val(0);
        for (var key in this._data.humans) {
          $('#' + key).val(this._data.humans[key]);
        }
        if (this._data.reptiles_fleet && this._data.reptiles_level) {
          $('#reptiles-fleet').val(this._data.reptiles_fleet);
          $('#reptiles-level').val(this._data.reptiles_level);
          $('#reptiles-level').change();
        }
        else {
          for (var key in this._data.reptiles) {
            $('#' + key).val(this._data.reptiles[key]);
          }
        }
        $('#run_calc').click();
        return false;
      });

      if ($('#recent a').length > 0) {
        $('#recent').prepend('<span>, </span>');
      }
      $('#recent').prepend($item);
    }
  }

  drawRecent();

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

    sessionStorage['CJC_fleet'] = JSON.stringify(humans);

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

    if (is_recent) {
      is_recent = false;
    } else {
      var recent = (sessionStorage['CJC_recent']? JSON.parse(sessionStorage['CJC_recent']): false) || [];
      // удаляем последний элемент
      if (recent.length > 5) {
        recent.pop();
      }

      recent.unshift({
        humans: humans_original,
        reptiles: reptiles_original,
        rounds: battleResults.rounds,
        losses: battleResults.losses,
        reptiles_fleet: $('#reptiles-fleet').val(),
        reptiles_level: $('#reptiles-level').val(),
        won: battleResults.won
      });
      sessionStorage['CJC_recent'] = JSON.stringify(recent);
    }

    battleResults['reptiles_fleet'] = $('#reptiles-fleet').val();
    battleResults['reptiles_level'] = $('#reptiles-level').val();


    drawBattle(battleResults);

    drawRecent();
  });

  //
  if (sessionStorage['CJC_reptiles']) {
    $('#reptiles-fleet').val(sessionStorage['CJC_reptiles']);
  }
  if (sessionStorage['CJC_reptiles_lvl']) {
    $('#reptiles-level').val(sessionStorage['CJC_reptiles_lvl']);
  }
  $('#reptiles-fleet, #reptiles-level').on('change', function() {
    sessionStorage['CJC_reptiles'] = $('#reptiles-fleet').val();
    sessionStorage['CJC_reptiles_lvl'] = $('#reptiles-level').val();
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
  }).change();

  // Проставляем последний флот если он был
  if (sessionStorage['CJC_fleet']) {
    var fleet = JSON.parse(sessionStorage['CJC_fleet']);
    for (var key in fleet) {
      $('#' + key).val(fleet[key]);
    }
  }

  $.fn.serializeObject = function(){

      var self = this,
          json = {},
          push_counters = {},
          patterns = {
              "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
              "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
              "push":     /^$/,
              "fixed":    /^\d+$/,
              "named":    /^[a-zA-Z0-9_]+$/
          };


      this.build = function(base, key, value){
          base[key] = value;
          return base;
      };

      this.push_counter = function(key){
          if(push_counters[key] === undefined){
              push_counters[key] = 0;
          }
          return push_counters[key]++;
      };

      $.each($(this).serializeArray(), function(){

          // skip invalid keys
          if(!patterns.validate.test(this.name)){
              return;
          }

          var k,
              keys = this.name.match(patterns.key),
              merge = this.value,
              reverse_key = this.name;

          while((k = keys.pop()) !== undefined){

              // adjust reverse_key
              reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

              // push
              if(k.match(patterns.push)){
                  merge = self.build([], self.push_counter(reverse_key), merge);
              }

              // fixed
              else if(k.match(patterns.fixed)){
                  merge = self.build([], k, merge);
              }

              // named
              else if(k.match(patterns.named)){
                  merge = self.build({}, k, merge);
              }
          }

          json = $.extend(true, json, merge);
      });

      return json;
  };
  // Сохранение улучшений
  $('#save-augmentations').on('click', function() {
    var config = $('#augmentations-modal form').serializeObject();
    CJC.setConfig(config);
    $('#augmentations-modal').modal('hide');
    return true;
  });

  // Простановка значений для улучшений
  var config = CJC.getConfig();

  function setParam(name, value, parent) {
    var type = String(typeof(value)).toLowerCase();
    if (type == 'object') {
      for (var key in value) {
        setParam(key, value[key], name);
      }
    }
    else {
      if (parent) {
        name = parent + '[' + name + ']';
      }
      var $input = $('#augmentations-modal input[name="' + name + '"]');
      if ($input.attr('type') == 'checkbox') {
        if (value == 'on') {
          $input.prop('checked', true);
        }
        else {
          $input.prop('checked', false);
        }
      }
      else {
        $input.val(value);
      }
    }
  }
  setParam(null, config, null);


  $('#input-reptiles input').on('mouseup', function() {
    $('#reptiles-fleet, #reptiles-level').val('');
  });
});