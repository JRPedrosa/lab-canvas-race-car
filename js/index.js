window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };


  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");


  const game = {
    frames: 0,
    obstacles: [],
    start: () => {
        interval = setInterval(() => {
            updateCanvas();
        }, 10);
    },

    stop: () => {
        clearInterval(interval);
    },

    clear: () => {
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    },

    score: () => {
        const points = Math.floor(game.frames / 5);
        context.font = "15px Arial";
        context.fillStyle = "black";
        context.fillText(`Score: ${points}`, 200, 50);
    },

    reset: () => {
        window.location.reload(false);
    }
}



  const road = new Image();
  road.src = "./images/road.png";
  roadLoad = () => {
      context.drawImage(road, 0, 0, canvas.clientWidth, canvas.clientHeight);
  }
  
class Car {
    constructor(x, y, width, height) {

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = 0;
      
      const img = new Image();
      img.src = "./images/car.png";
      this.image = img;
    }


    draw() {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
      this.x += this.speed;
    }

    left() {
      return this.x;
    }

    right() {
      return this.x + this.width;
    }

    top() {
      return this.y;
    }

    bottom() {
      return this.y + this.height;
    }

    boundaries() {
      if (this.left() < 50) {
        return "left";
      } else if (this.right() > 450) {
        return "right";
      }
    }
      
    
    crashWith(component) {
      return !(
          this.bottom() < component.top() ||
          this.top() > component.bottom() ||
          this.right() < component.left() ||
          this.left() > component.right()
      );
  }

}

const player = new Car(225, canvas.clientHeight - 100, 50, 100);

class Component {
  constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.speedY = 0;
      this.speedX = 0;
  }

  draw() {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
      this.x += this.speedX;
      this.y += this.speedY;
  }

  left() {
      return this.x;
  }

  right() {
      return this.x + this.width;
  }

  top() {
      return this.y;
  }

  bottom() {
      return this.y + this.height;
  }

  crashWith(component) {
      return !(
          this.bottom() < component.top() ||
          this.top() > component.bottom() ||
          this.right() < component.left() ||
          this.left() > component.right()
      );
  }
}





function drawObstacles() {

  game.obstacles.forEach((obstacle) => {
      obstacle.y += 1;
      obstacle.draw();
  })

  game.frames++;

  if (game.frames % 170 === 0) {
      const minHeight = 50;
      const maxHeight = 240;
      const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

      const minGap = 70;
      const maxGap = 260;
      const randomGap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

      //Create top obstacle
      let obstacleTop = new Component(
          randomHeight,
          0,
          randomGap,
          15, 
          "crimson");

      game.obstacles.push(obstacleTop);

      //Create bottom obstacle
      // let obstacleBottom = new Component(
      //     canvas.clientWidth, 
      //     randomHeight + randomGap, 
      //     10, 
      //     canvas.clientHeight - (randomHeight + randomGap), 
      //     "green");

      // game.obstacles.push(obstacleBottom);

      
  }
}











document.addEventListener("keydown", (e) => {
  switch(e.key) {
      case "ArrowLeft":
          player.speed -= 1;
          break;
      case "ArrowRight":
          player.speed += 1;
          break;
      case "Enter":
          game.reset();
          break;
  }
});

document.addEventListener("keyup", (e) => {
  player.speed = 0;
})

  
function updateCanvas() {
  game.clear();
  roadLoad();
  player.draw();
  player.move();
  boundaries();
  drawObstacles();
  checkGameOver();
  game.score();
}


function boundaries() {
  if (player.boundaries() === "left") {
    player.speed = 0;
    player.x = 50;
  } else if (player.boundaries() === "right") {
    player.speed = 0;
    player.x = 400;
  }
}


function checkGameOver() {
  const crashed = game.obstacles.some((obstacle) => {
      return player.crashWith(obstacle) === true;
  });

  if (crashed) {
      game.stop();
  }
}

function startGame() {
    game.start();
};





};
