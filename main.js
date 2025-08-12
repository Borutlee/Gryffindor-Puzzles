let title = document.querySelector('title');
let image = document.getElementsByClassName("image")[1];
let btn = document.getElementsByClassName('button')[0];
let text = document.querySelector('h2');
let optionsparent = document.getElementsByClassName('options')[0];

let changeQ = 0;
let questionsData = [];

let music = document.getElementById('music');

function apiquestions() {
    fetch('puzzle.json')
    .then(response => response.json())
    .then(data => {
        questionsData = data.puzzles;
        btn.addEventListener('click', () => {
            image.style.display = 'none';
            btn.style.display = 'none';
            music.play()
            document.querySelector('.puzzle .container').style.position = 'relative';
            document.querySelector('.puzzle .container').style.flexDirection = 'column';
            showQuestion();
        });
    });
}

function updateGridColumns() {
    if (!optionsparent) return;
    if (window.innerWidth <= 480) {
        optionsparent.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth <= 768) {
        optionsparent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
    } else {
        optionsparent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
    }
}

function showQuestion() {
    let puzzle = questionsData[changeQ];
    let options = puzzle.options;

    title.textContent = puzzle.title;
    document.getElementsByClassName('puzzle')[0].style.backgroundImage  = `url(media/image${changeQ}.png)`;

    optionsparent.style.display = "grid";
    optionsparent.style.gap = "20px";
    optionsparent.style.marginTop = "20px";
    optionsparent.style.listStyle = "none";
    optionsparent.style.padding = "0";
    updateGridColumns();

    text.style.textAlign = 'center';
    text.style.padding = '10px';
    text.style.lineHeight = '1.8';
    text.style.fontSize = '20px';
    text.style.transition = '0.5s';

    optionsparent.innerHTML = "";

    // كتابة السؤال ثم إظهار الاختيارات بالأنيميشن
    typingeffect(text, puzzle.question, () => {
        options.forEach((option, index) => {
            let li = document.createElement('li');
            li.className = 'list';
            li.style.listStyle = 'none';
            li.style.background = 'linear-gradient(135deg, #b71c1c, #ffcc00)';
            li.style.color = 'white';
            li.style.fontSize = '1.2rem';
            li.style.fontWeight = 'bold';
            li.style.padding = '15px';
            li.style.borderRadius = '50px';
            li.style.textAlign = 'center';
            li.style.cursor = 'pointer';
            li.style.wordBreak = 'break-word';
            li.style.opacity = '0';
            li.style.transform = 'translateY(20px)';
            li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            let span = document.createElement('span');
            span.className = 'span';
            span.textContent = option;

            li.appendChild(span);
            optionsparent.appendChild(li);

            // تأخير الظهور لكل اختيار
            setTimeout(() => {
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, index * 150);

            li.addEventListener('click', () => {
                if (span.textContent === puzzle.answer) {
                    span.style.color = 'green';
                    document.querySelectorAll('.list').forEach(el => {
                        if (el.textContent !== puzzle.answer) {
                            el.style.pointerEvents = 'none';
                            el.style.opacity = '0.5';
                        }
                    });

                    setTimeout(() => {
                        changeQ++;
                        if (changeQ < questionsData.length) {
                            showQuestion();
                        } else {
                            showCredits()
                            document.querySelector('.puzzle').style.backgroundImage = 'url(../media/Great hall.png)';
                        }
                    }, 1000);

                } else {
                    span.style.color = 'red';
                    document.querySelectorAll('.list').forEach(el => {
                        if (el !== li) {
                            el.style.pointerEvents = 'none';
                            el.style.opacity = '0.5';
                            setTimeout(() => {                                    
                                el.style.pointerEvents = 'auto';
                                el.style.opacity = '1';
                            }, 1200);
                        }
                    });
                    setTimeout(() => {
                        span.style.color = 'black';
                        changeQ = 0;
                        showQuestion();
                    }, 1500);
                }
            });
        });
    });
}

window.addEventListener('resize', updateGridColumns);

apiquestions();

function typingeffect(element, text , callback) {
    let x = 0;
    element.textContent = '';

    function typing(){
        if (x < text.length){
            element.textContent += text.charAt(x);
            x++;
            setTimeout(typing, 50);
        }
        else if (callback){
            callback();
        }
    }
    typing();
}
function showCredits() {
    let creditsText = `
🎉 أحسنت! لقد تم تحريرك من الكتاب وأصبحت ساحرًا حرًا!
لقد انتصرت على الأشرار وحققت النصر 🏆

👑 Supervisor
🪄 Dianna R. Nott

🤝 Participants
🪄 Anderson R. Nott
🪄 Albanus Shireveil
🪄 Albus S. Weasley
🪄 Amelia Bones
🪄 Drexel Knox
🪄 Zoro Miyamoto
🪄 Phoenix Salvatore
🪄 Chris C. Black
🪄 Elssa S. Weasley
🪄 Sesilia Verena
🪄 Sylvara Nox
🪄 Armin William
🪄 Mira Kai
🪄 Lina Thomas
🪄 Leona Darnfire
🪄 Selene Ndayla

💻 Programmer
🪄 borutlee
`;

    text.style.whiteSpace = "pre-line";
    text.style.textAlign = "center";
    text.style.fontSize = "1.2em";
    text.style.color = "white";
    text.textContent = "";

    let i = 0;
    function typeNextChar() {
        if (i < creditsText.length) {
            text.textContent += creditsText.charAt(i);
            i++;
            setTimeout(typeNextChar, 40); // سرعة الكتابة
        }
    }
    typeNextChar();

    optionsparent.innerHTML = "";
    document.querySelector('.puzzle').style.backgroundImage = 'url(media/image4.png)';
}

