/** App Function */

const QuizGame = () => {
  
    // Set time
    let totalTime = 60;
    let gameTime = 0;
  
    // Set scores
    let correct = 0;
    let wrong = 0;
    const total = questions.length;
  
    const init = () => {
      $(document).ready(function () {
        $('.scores_nav').on('click', checkRankingSubmit);
        $('body').on('click','.scores', checkRankingSubmit);
        $('.start_game').on('click', startGame);
        $('body').on("click",'.clear-highscore',clearHighScore);
      })
    }
  
    const startGame = (e) => {
    
      $('.scores').show();
      $(".timer-btn").show();
      $('.time').show();
      $('.quiz').show();
      $('.intro').hide();
      $('.score_table').html('')
  
      // Change bg color
      // document.getElementsByTagName('nav')[0].style.borderBottom = '1px solid #7DE38D';
      // document.getElementsByTagName('body')[0].style.backgroundColor = '#ccc';
      displayQuestion();
  
      $('.time').text(totalTime);
      stopWatch();
    }
  
    
    const clearHighScore = ()=>{
      localStorage.removeItem('players');
      displayRankings();
    }
    const displayQuestion = () => {
      const question = questions.shift();
      if(!question){
        endGame();
      }
      // console.log(questions);
      const quiz = $(`<div class="card quiz_card ">
                        <div class= "card-header">
                          ${question.title}
                        </div>
                      </div >`);
  
      const choicesList = $('<ul class="list-group"></ul>');
  
      choicesList.on('click', (e) => { handleAnswerClick(e, question.answer) })
  
      question['choices'].forEach(choice => {
        choicesList.append(`<li class="list-group-item mt-3">${choice}</li>`);
      })
      
      quiz.append(choicesList);
      quiz.append('<button class="btn btn-outline-danger mt-3  scores" >End Quiz</button>')
      $('.quiz').append(quiz);
    }
    
    const handleAnswerClick = (e, answer) => {
      e.preventDefault();
  
      if ($(e.target).html() === answer) {
        e.target.style.backgroundColor = '#28a745';
        correct++;
        totalTime++;
        setTimeout(() => {
          $('.quiz').empty();
          if (questions.length !== 0) {
            displayQuestion();
          }else {
            gameTime = totalTime;
            endGame();
            $('.time').text(totalTime);
            totalTime = 0;
          }
        }, 1000);
      } else {
        wrong++;
        e.target.style.borderColor = '#dc3545';
        e.target.style.backgroundColor = '#dc3545';
        setTimeout(() => {
          totalTime -= 5;
          if (totalTime <= 0) {
            totalTime = 0
          }
          $('.quiz').empty();
          displayQuestion();
        }, 1000);
      }
    }
  
    const stopWatch = () => {
      if (totalTime === 0) {
        // gameTime = totalTime;
        endGame();
        $('.time').text(totalTime);
      }
      if (totalTime > 0) {
        $('.time').text(totalTime--);
        setTimeout(stopWatch, 1000);
      }
    }
  
    const endGame = () => {
      displayScorecard();
      $('#nameSubmit').on('click', handleInputSubmit);
    }
  
    const displayScorecard = () => {
      $('.quiz').hide();
      $('.scores').hide();
      $('.time').hide();
      $(".timer-btn").hide();
      $('.intro').hide();
  
      $('.score_card').html(
        `<div class="card score">
          <h1 class="title text-center pt-3 pl-4 pr-4">Quiz Scorecard</h1>
          <div class="card-header">
            <p class="result py-4">Score: ${correct}</p>
          </div>
          
        </div>
        <div class="input-group mt-5">
          <input type="text" class="form-control player" placeholder="Initials" aria-label="Username" aria-describedby="basic-addon1">
          <div class="input-group-append">
            <button class="btn btn-outline-success" type="button" id="nameSubmit">Submit</button>
          </div>
        </div>`);
    } 
  
    const handleInputSubmit = (e) => {
  
      if($('.player').val()==''){
        alert('Please Enter you initials.')
        return false;
      }
      e.preventDefault();
  
      $('.score_card').hide();
      $('.score_table').show();
      $('.score_table').html('')
  
      const playerName = $('.player').val();
      const player = {
        name: playerName,
        score: correct
      }
      // console.log(player);
      saveToLocalStorage(player);
      displayRankings(player);
      $('.scores_nav').prop('disabled', false);
    }
  
    const displayRankings = (currentPlayer = {}) => {
      const players = JSON.parse(localStorage.getItem('players'));
      $('.score_table').html('')
      const rankings = $(`<div class="card">
                        <div class= "card-header">
                          <h3> HighScores <span class="clear-highscore btn btn-sm btn-outline-danger">Clear X</span></h3>
                        </div>
                      </div >`);
  
      const playerList = $('<ul class="list-group list-group-flush"></ul>');
      
      if(players !== null) {
        sortArray(players);
        players.forEach((player, index) => {
          if (currentPlayer.name === player.name && currentPlayer !== {}) {
            playerList.append(`<li class="list-group-item font-weight-bold mt-1">${index + 1}. ${player.name} <span class="player_score">${player.score}</span></li>`);
          } else {
            playerList.append(`<li class="list-group-item mt-1">${index + 1}. ${player.name} <span class="player_score">${player.score}</span></li>`);
          }
        })
      }
      
      rankings.append(playerList);
      $('.score_table').append(rankings);
    }
  
    const checkRankingSubmit = (event) => {
      if ($(event.target).hasClass('scores_nav')) {
        $('.scores_nav').prop('disabled', true);
        displayRankings();
      } else {
        endGame();
        // $('.score_card').hide();
        $('.scores_nav').prop('disabled', true);
        // displayRankings();
      }
    }
  
    // Array that sorts the players array by the score
    const sortArray = (arr) => {
      arr.sort((a, b) => {
        const scoreA = a.score;
        const scoreB = b.score;
        if (scoreA < scoreB)
          return 1
        if (scoreA > scoreB)
          return -1
        return 0
      })
    }
  
    // Saves the player to the LocalStorage
    const saveToLocalStorage = (player) => {
      if (localStorage.getItem('players') === null) {
        const players = [];
        players.push(player);
        localStorage.setItem('players', JSON.stringify(players));
      } else {
        const players = JSON.parse(localStorage.getItem('players'));
        players.push(player);
        localStorage.setItem('players', JSON.stringify(players));
      }
    }
  
    init();
  }
  
  QuizGame();
  
  
  
  
  
  
  
  
  
  
  
  
  