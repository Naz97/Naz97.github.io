// start quiz
$('.start-quiz').click(function () {
	// clear result
	$('.result').empty();
	// start quiz
    $('.container .intro').slideUp(500, function() {
		// display 1-st question
		$('.question:first-of-type').show(0);
		// counter
		$('.quiz .status .counter .count').html('1');
		// timer
		t = 1;
		timer = setInterval(function() {
			$('.quiz .status .timer .time').html(t);
			t++;
		}, 1000);
		// show quiz
		$('.container .quiz').slideDown(300);
	});
	// questions count
	countQuestions = $('.quiz > .question').length;
	// answers array
	answers = [];
});
// answer to question
$('.answer').click(function() {
	var idQuestion = $(this).data('id'),
		elementQuestion = $('.question[data-id=' + idQuestion + ']'),
		answer = elementQuestion.find('input[name=answer]:checked').val(),
		i = $('.quiz .status .counter .count').html();
	if (!answer) {
		alert('Պատասխանն ընտրված չէ');
	} else {
		// show counter
		i++;
		// add answer to array
		answers.push(answer);
		// answers counter
		if (i <= countQuestions) {
			$('.quiz .status .counter .count').html(i);
			// show questions
			elementQuestion.slideUp(300, function() {
				$(this).next().slideDown(300);
			});
		}
		// result
		else {
			// hide last question
			elementQuestion.slideUp(300, function() {
				// show result
				clearInterval(timer);
				// get time
				var time = $('.quiz .status .timer .time').html();
				// convert answers to json
				var answersJson = JSON.stringify(answers);
				// result element
				var result = $('.quiz .result');
				// send
				$.ajax({
					url: '/cmd/quiz_result',
					type: 'post',
					data: { quiz_answers: answersJson, time: time },
					beforeSend: function() {
						// loading
						result.hide(0).html('<i class="fa fa-circle-o-notch fa-spin"></i>').slideDown(300);
					},
					success: function(data) {
						data = JSON.parse(data);
						// action
						setTimeout(function() {
							// some error
							if (data.code == 0) {
								result.addClass('red').html('<i class="fa fa-times-circle"></i> ' + data.message);
							}
							// done
							else if (data.code == 1) {
								result.html(data.message);
							}
							// error other
							else {
								result.addClass('red').html('<i class="fa fa-times-circle"></i>');
								alert('Տեղի ունեցավ սխալ, խնդրում ենք թարմացնել էջը և կրկին փորձել:');
							}
							result.hide(0).slideDown(300);
						}, 300);
					},
					error: function() {
						alert('Տեղի ունեցավ սխալ, խնդրում ենք թարմացնել էջը և կրկին փորձել:');
					}
				});
			});
		}
    }
});