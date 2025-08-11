let title = document.querySelector('title');
let image = document.getElementsByClassName("image")[1];
let btn = document.getElementsByClassName('button')[0];
let text = document.querySelector('h2');
let optionsparent = document.getElementsByClassName('options')[0];

let changeQ = 0;
let questionsData = []; // نخزن الأسئلة هنا

function apiquestions() {
    fetch('puzzle.json')
    .then(response => response.json())
    .then(data => {
        questionsData = data.puzzles; // نخزنهم في المصفوفة
        btn.addEventListener('click', () => {
            image.style.display = 'none';
            btn.style.display = 'none';
            document.querySelector('.puzzle .container').style.flexDirection = 'column';
            showQuestion(); // عرض أول سؤال
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
    document.getElementsByClassName('puzzle')[0].style.backgroundImage  = `url(${puzzle.background})`;

    // إعداد مظهر قائمة الاختيارات
    optionsparent.style.display = "grid";
    optionsparent.style.gap = "20px";
    optionsparent.style.marginTop = "20px";
    optionsparent.style.listStyle = "none";
    optionsparent.style.padding = "0";
    updateGridColumns();  // ضبط أعمدة الشبكة حسب حجم الشاشة

    // عرض السؤال
    typingeffect(text, puzzle.question);
    text.style.textAlign = 'center';
    text.style.padding = '10px';
    text.style.lineHeight = '1.8';
    text.style.fontSize = '25px';
    text.style.transition = '0.5s'


    // تفريغ القديم
    optionsparent.innerHTML = "";

    options.forEach(option => {
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
        li.style.transition = '0.3s';
        li.style.wordBreak = 'break-word'; // لتجنب خروج النص خارج العنصر

        let span = document.createElement('span');
        span.className = 'span';
        span.textContent = option;

        li.appendChild(span);
        optionsparent.appendChild(li);

        li.addEventListener('click', () => {
            if (span.textContent === puzzle.answer) {
                // الإجابة الصحيحة
                span.style.color = 'green';
                document.querySelectorAll('.list').forEach(el => {
                    if (el.textContent !== puzzle.answer) {
                        el.style.pointerEvents = 'none';
                        el.style.opacity = '0.5';
                    }
                });

                // الانتقال للسؤال التالي بعد ثانية
                setTimeout(() => {
                    changeQ++;
                    if (changeQ < questionsData.length) {
                        showQuestion();
                    } else {
                        text.textContent = "انتهت الأسئلة 🎉";
                        optionsparent.innerHTML = "";
                        puzzle.style.backgroundImage = 'url(../media/)'
                    }
                }, 1000);

            } else {
                // الإجابة الغلط
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
                }, 1500);
            }
        });
    });
}

// ضبط الأعمدة عند تغيير حجم النافذة
window.addEventListener('resize', updateGridColumns);

apiquestions();

function typingeffect(element, text , callback) {
    let x = 0;
    element.textContent = '';

    function typing(){
        if (x < text.length){
            element.textContent += text.charAt(x);
            x++;
            setInterval(typing, 500);
        }
        else if (callback){
            callback();
        }
    }
    typing();

}
