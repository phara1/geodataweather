let rClicks = 0;
        let lClicks = 0;
        let countMover = 0;
        let arrParser = 0;

        let arrText = [" ",
            "You just smashed the MOUSE!!! CONGRATS!!!", 
                        "IS THAT ITS EYE BALL???? AMAZINGG!!!!",
                        "OH NOOOO, ITS TAIL IS NOW BROKEN????"];

        

        function countLeftClicks() {
            lClicks += 1;

            document.getElementById("leftClicks").innerHTML = lClicks;

        };
        function countRightClicks() {
            event.preventDefault();
            rClicks += 1;

            document.getElementById("rightClicks").innerHTML = rClicks;
        };

        function btnMover(){
            if(lClicks + rClicks == countMover+10){
                countMover = lClicks + rClicks;
                let btn = document.getElementById("rapeBtn");
                let random = Math.floor(Math.random() * 4);

                switch(random) {
                    case 0:
                        btn.style.cssText = `
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        `;
                        arrParser = 1;
                        break;
                    case 1:
                        btn.style.cssText = `
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        `;
                        arrParser = 1;
                        break;  
                    case 2:
                        btn.style.cssText = `
                        position: absolute;
                        top: 0;
                        right: 0;
                        `;
                        arrParser = 2;
                        break;

                    case 3:
                        btn.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        `;
                        arrParser = 3;
                        break;
                }
                document.getElementById("pasteText").innerHTML = arrText[arrParser];
            }
        }