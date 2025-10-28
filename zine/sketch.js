let totalPages = 8;
let currentPage = 0;
let zinePages = [];
let mode = "intro"; // intro, draw, booklet, email
let nextButton, backButton, makeBookletButton, emailButton, startButton;
let emailInput, sendButton;
let bookletIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Futura');
  textAlign(CENTER, CENTER);

  // create zine pages
  for (let i = 0; i < totalPages; i++) {
    let pg = createGraphics(windowWidth, windowHeight);
    pg.background(255);
    zinePages.push(pg);
  }

  createButtons();
}

function createButtons() {
  startButton = createButton("Start Zine →");
  startButton.position(width / 2 - 60, height / 2 + 60);
  startButton.mousePressed(() => {
    mode = "draw";
    startButton.hide();
  });

  nextButton = createButton("Next →");
  nextButton.position(width - 150, height - 60);
  nextButton.mousePressed(nextPage);
  nextButton.hide();

  backButton = createButton("← Back");
  backButton.position(50, height - 60);
  backButton.mousePressed(prevPage);
  backButton.hide();

  makeBookletButton = createButton("Make Booklet");
  makeBookletButton.position(width / 2 - 60, height - 60);
  makeBookletButton.mousePressed(() => {
    mode = "booklet";
    bookletIndex = 0;
  });
  makeBookletButton.hide();

  emailButton = createButton("Share via Email");
  emailButton.position(width / 2 - 70, height - 60);
  emailButton.mousePressed(() => {
    mode = "email";
    showEmailPage();
  });
  emailButton.hide();
}

function draw() {
  background(255);

  if (mode === "intro") {
    drawIntroScreen();
  } else if (mode === "draw") {
    drawPage();
  } else if (mode === "booklet") {
    drawBookletView();
  } else if (mode === "email") {
    drawEmailPage();
  }
}

// -------- INTRO SCREEN --------
function drawIntroScreen() {
  background(255);
  fill(0, 0, 139);
  textSize(48);
  text("Let's Make a Virtual Zine!", width / 2, height / 2 - 60);
  textSize(20);
  fill(0);
  text("You’ll get 8 pages to draw and then compile your own booklet.", width / 2, height / 2);
  startButton.show();
}

// -------- DRAW MODE --------
function drawPage() {
  image(zinePages[currentPage], 0, 0);

  fill(0);
  noStroke();
  textSize(24);
  text(`Page ${currentPage + 1} of ${totalPages}`, width / 2, 40);
  textSize(16);
  text("Draw anywhere! Use your mouse.", width / 2, 70);

  backButton.show();
  nextButton.show();

  if (currentPage === totalPages - 1) {
    makeBookletButton.show();
  } else {
    makeBookletButton.hide();
  }

  emailButton.hide();
  if (emailInput) emailInput.hide();
  if (sendButton) sendButton.hide();
}

function mouseDragged() {
  if (mode === "draw") {
    let pg = zinePages[currentPage];
    pg.stroke(0, 0, 139);
    pg.strokeWeight(4);
    pg.line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// -------- PAGE CONTROLS --------
function nextPage() {
  if (mode === "draw") {
    currentPage++;
    if (currentPage >= totalPages) {
      currentPage = totalPages - 1;
    }
  }
}

function prevPage() {
  if (mode === "draw") {
    currentPage--;
    if (currentPage < 0) {
      currentPage = 0;
    }
  }
}

// -------- BOOKLET MODE --------
function drawBookletView() {
  background(255);
  imageMode(CENTER);
  image(zinePages[bookletIndex], width / 2, height / 2, width * 0.8, height * 0.8);

  fill(0);
  textSize(22);
  text(`Zine Booklet — Page ${bookletIndex + 1} of ${totalPages}`, width / 2, 40);
  text("Use ← and → to flip through pages. Press D to go back to edit.", width / 2, height - 60);

  nextButton.hide();
  backButton.hide();
  makeBookletButton.hide();
  emailButton.show();

  if (emailInput) emailInput.hide();
  if (sendButton) sendButton.hide();
}

function keyPressed() {
  if (mode === "booklet") {
    if (keyCode === RIGHT_ARROW) {
      bookletIndex = (bookletIndex + 1) % totalPages;
    } else if (keyCode === LEFT_ARROW) {
      bookletIndex = (bookletIndex - 1 + totalPages) % totalPages;
    } else if (key === "D") {
      mode = "draw";
      currentPage = 0;
    }
  }
}

// -------- EMAIL MODE --------
function showEmailPage() {
  if (!emailInput) {
    emailInput = createInput('');
    emailInput.position(width / 2 - 120, height / 2);
    emailInput.size(240);
    emailInput.attribute('placeholder', 'Enter your email address');
  }

  if (!sendButton) {
    sendButton = createButton('Send to Me');
    sendButton.position(width / 2 - 50, height / 2 + 50);
    sendButton.mousePressed(sendZineEmail);
  }

  emailInput.show();
  sendButton.show();
}

function drawEmailPage() {
  background(255);
  textSize(28);
  fill(0, 0, 139);
  text("Share Your Zine!", width / 2, height / 2 - 100);
  textSize(18);
  fill(0);
  text("Enter your email below and click 'Send to Me'", width / 2, height / 2 - 60);

  nextButton.hide();
  backButton.hide();
  makeBookletButton.hide();
  emailButton.hide();
}

function sendZineEmail() {
  const email = emailInput.value();
  if (!email) {
    alert("Please enter your email address first!");
    return;
  }

  const subject = encodeURIComponent("My Virtual Zine");
  const body = encodeURIComponent("Here’s my virtual zine! (Currently you’ll need to export images manually)");
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}
