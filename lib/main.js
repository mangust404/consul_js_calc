$(function() {
	$('#run_calc').click(function() {
    var humans = {};
    $('#input-humans input').each(function() {
      humans[this.id] = $(this).val();
    });

    var reptiles = {};
    $('#input-reptiles input').each(function() {
      reptiles[this.id] = $(this).val();
    });

    CJC.calculateBattle();
  });
})