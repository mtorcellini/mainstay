$(document).ready(() => {

    const questions = [
        {
            prompt: "How many new hires do you onboard per month?",
            type: "buttons",
            responses: [
                "0-200",
                "200-400",
                "400-600"
            ]
        },
        {
            prompt: "What percentage of hires drop off per month?",
            type: "buttons",
            responses: [
                "25%",
                "50%",
                "75%",
                "100%"
            ]
        },
        {
            prompt: "What is the total salary of HR and Talent Acquisition resources?",
            type: "slider",
            indicator: "moving",
            thumbSize: 20,
            min: 0,
            max: 100000
        },
        {
            prompt: "What is the average number of voluntary resignations for new hires in the first 90 days?",
            type: "buttons",
            responses: [
                "0-10",
                "10-20",
                "20-30",
                "30+"
            ]
        }
    ]
    
    const questionsPerPage = 2;
    
    const numPages = questions.length / questionsPerPage;
    const savedData = [];
    let page = 0;
    const submissionForm = $('.submission-form');

    const costToHire = 1633;
    const reduceNoShowsRate = 0.5;
    const increaseNewHireRetention = 0.1;
    const answerRateForFAQs = 0.8;
    const opperationalEfficiencyGain = 0.2;

    const showNext = () => {
        page++;
        goToPage(page);
    }

    const showPrev = () => {
        page--;
        goToPage(page);
    }

    const goToPage = pageToGoTo => {
        page = pageToGoTo;
        if (page == 0) {
            // page 0
            $('.prev').hide();
            $('.next').show();
            $('.form').empty();
            showQuestion(page*2);
            showQuestion(page*2+1);
        } else if (page == numPages) {
            // last page (submission form)
            $('.next').hide();
            $('.prev').show();
            showSubmissionForm();
        } else {
            // any other page
            $('.form').empty();
            $('.prev').show();
            $('.next').show();
            showQuestion(page*2);
            showQuestion(page*2+1);
        }
        $('.pagination .pg-btn').removeClass('active');
        $(`.pagination .pg-btn.pg-${page}`).addClass('active');

    }

    const makePagination = () => {
        if (!numPages) {return}

        for (i=0; i<=numPages; i++) {
            const pageButton = $('<div>').addClass(`pg-btn pg-${i}`).data('page', i);
            $('.pagination').append(pageButton)
        }

        $('.pg-btn').on('click', function() {
            page = $(this).data('page');
            goToPage(page);
        });

        const firstBtn = $('.pagination').find('.pg-btn')[0];
        $(firstBtn).addClass('active');
    }

    const buildQuestion = questionNum => {
        const question = $('<div>').addClass(`question q${questionNum}`);
        const prompt = $('<p>').html(questions[questionNum].prompt);
        const type = questions[questionNum].type;
        switch (type) {
            case "buttons":
                const responseDiv = $('<div>').addClass('responses');
                const responses = questions[questionNum].responses.map((res, index) => {
                    const div = $('<div>').addClass(`response res${index}`);
                    div.html(res);
                    const button = $('<button>').addClass('response-button').data({'questionNum': questionNum, 'responseVal': res, 'responseNum': index});
        
                    // add btn listeners
                    button.on('click', function() {
                        // console.log($(this).data());
                        $(this).parents('.responses').find('.response-button').removeClass('selected');
                        $(this).addClass('selected');
                        const {questionNum, responseVal, responseNum} = $(this).data();
                        savedData[questionNum] = {
                            questionNum,
                            responseVal,
                            responseNum
                        };
                    })
        
                    div.prepend(button);
        
                    return div;
                })
                question.append(prompt);
                question.append(responseDiv);
                responseDiv.append(responses);
                break;
            case "slider":  
                // build slider
                const slider = $('<input>').attr({
                    'type': 'range', 
                    'min': questions[questionNum].min, 
                    'max': questions[questionNum].max, 
                    'val': 0
                });
                slider.addClass('slider');

                //build indicator
                const indicator = $('<div>').addClass('indicator');
                indicator.html(0);

                // add slider listener
                slider.on('input', function() {
                    indicator.html($(this).val());

                    if (questions[questionNum].indicator == 'moving') {
                        const rangePercent = ($(this).val()-$(this).attr('min')) / ($(this).attr('max')-$(this).attr('min'));
                        // console.log('rP: ', rangePercent);
                        // let leftOffset = rangePercent * $(this).width();
                        let leftOffset = rangePercent * ($(this).width() - 20);
                        indicator.css({
                            'position': 'relative', 
                            'left': leftOffset + "px",
                        })
                    }
                    savedData[questionNum] = {
                        questionNum: questionNum,
                        responseVal: $(this).val(),
                        responseNum: null
                    }
                })

                question.append(prompt);
                question.append(indicator);
                question.append(slider);

                break;
            
            default:
                break;
        }

        return question;
    }

    const showQuestion = questionNum => {
        $('.form').append(buildQuestion(questionNum));
    }

    const showSubmissionForm = () => {
        $('.form').empty();
        $('.form').append(submissionForm);
        submissionForm.show();
    }

    const calcSavings = (responses) => {
        console.log(responses);

        let newHiresPerMonth = responses[0].responseVal;
        let newHireDropOff = responses[1].responseVal;
        let salaryHRandTalent = responses[2].responseVal;
        let monthlyResignations = responses[3].responseVal;

        const newHiresPerMonthMin = newHiresPerMonth.split('-')[0];
        const newHiresPerMonthMax = newHiresPerMonth.split('-')[1];
        let monthlyResignationsMin = monthlyResignations.split('-')[0];
        let monthlyResignationsMax = monthlyResignations.split('-')[1];
        newHireDropOff = parseInt(newHireDropOff) * .01;

        if (monthlyResignations.indexOf("+") != -1) {
            monthlyResignationsMin = parseInt(monthlyResignations);
            monthlyResignationsMax = NaN;
        }

        const dropOffsMin = newHiresPerMonthMin * newHireDropOff * 12;
        const dropOffsMax = newHiresPerMonthMax * newHireDropOff * 12;
        const savedNewHiresMin = dropOffsMin * reduceNoShowsRate;
        const savedNewHiresMax = dropOffsMax * reduceNoShowsRate;
        const recruitingCostSavingsMin = savedNewHiresMin * costToHire;
        const recrutingCostSavingsMax = savedNewHiresMax * costToHire;
        const efficiencyGains = salaryHRandTalent * opperationalEfficiencyGain;
        const employeeRetentionSavingsMin = increaseNewHireRetention * monthlyResignationsMin * costToHire * 12;
        const employeeRetentionSavingsMax = increaseNewHireRetention * monthlyResignationsMax * costToHire * 12;

        const totalAnnualValueMin = recruitingCostSavingsMin + efficiencyGains + employeeRetentionSavingsMin;
        const totalAnnualValueMax = recrutingCostSavingsMax + efficiencyGains + employeeRetentionSavingsMax;

        return [totalAnnualValueMin, totalAnnualValueMax];
    }

    // listeners
    $('.next').on('click', () => {
        // show next page of questions
        showNext();
    });

    $('.prev').on('click', () => {
        // show next page of questions
        showPrev();
    });

    $('.secretbutton').on('click', () => {
        let [min, max] = calcSavings(savedData);
        console.log(min, max);
    })

    const init = () => {
        $('.prev').hide();
        $('.form').empty();
        makePagination();
        showQuestion(0);
        showQuestion(1);
    }

    init();

})

