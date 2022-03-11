var navToggle = document.querySelector('.hamburger');
var navTarget = document.querySelector('.nav-target');
navToggle.addEventListener('click', () => {
  navTarget.classList.toggle('active');
  navToggle.classList.toggle('is-active');
})


$(document).ready(function () {
    var duration = 16000;
    var target = 5000;
    var loop = 0;
    var running = false;

    var values = [
        {box_1: 9, box_2: 9, box_3: 3},
        {box_1: 9, box_2: 1, box_3: 1},
        {box_1: 8, box_2: 1, box_3: 6},
        {box_1: 7, box_2: 8, box_3: 6},
        {box_1: 6, box_2: 2, box_3: 0},
        {box_1: 5, box_2: 6, box_3: 4},
        {box_1: 4, box_2: 3, box_3: 4},
        {box_1: 3, box_2:2, box_3: 4},
        {box_1: 2, box_2:5, box_3: 2},
        {box_1: 1, box_2:6, box_3: 5},
        {box_1: 1, box_2:2, box_3: 1},
        {box_1: 0, box_2:9, box_3: 7},
        {box_1: 0, box_2:6, box_3: 8},
        {box_1: 0, box_2:1, box_3: 0},
        {box_1: 0, box_2:0, box_3: 0},
    ];

    var box_1 = 9;
    var box_2 = 9;
    var box_3 = 9;

    setInterval(changeNumber, duration);

    // $("#submit").click(changeNumber);

    function changeNumber() {
        // if (target == 1) {
        //     target = 5000;
        // }
        // $(".counter").html('');
        // var number = Math.floor(Math.random() * (target - 1 + 1)) + 1;
        // target = number;



        box_1 = values[loop].box_1;
        $(".text-1").text(box_1);
        setTimeout(function () {
            box_2 = values[loop].box_2;
            $(".text-2").text(box_2);
        }, 250);
        setTimeout(function () {
            box_3 = values[loop].box_3;
            $(".text-3").text(box_3);
            if (loop == values.length - 1) {
                loop = 0;
            }else {
                loop++;
            }
        }, 600);
    }

});

var slider = tns({
    container: '#customer',
    items: 1,
    controls: false,
    nav: true,
    navContainer: ('.customer-control')
  });