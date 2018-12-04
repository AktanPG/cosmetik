const slider = document.querySelector('.slider-container');
const count = Number(slider.getAttribute('data-count'));

let left = 0;
let active = true;

setInterval(() => {
    if(active) {
        left = left - 1;

        if(left < 264 * -count + 264 * 4 + 200 - 64) {
            active = false
        }

        slider.style.left = left + 'px';
    } else {
        left = left + 1;

        if(left > 0) {
            active = true;
        }

        slider.style.left = left + 'px';
    }
}, 1000 / 100)