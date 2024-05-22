const Page = {
    width: 0,
    height: 0,
    init: () => {
        Page.events.register();
        Page.select.register();
        Page.ibge.states();
    },
    events: {
        register : () => {
            Page.width = window.innerWidth;
            Page.height = window.innerHeight;
            document.addEventListener("mousemove", Page.cursor.move);
            document.querySelectorAll(".hoverable").forEach(elm => Page.cursor.hoverables(elm));
            document.querySelectorAll("input[type='radio']").forEach(elm => elm.addEventListener("change", Page.events.radioClick));
        },
        radioClick: (ev) => {
            const target = ev.target;
            let container = target;
            if(!container.classList.contains("radio-area")) {
                do {
                    container = container.parentElement;
                } while (!container.classList.contains("radio-area"));
            }
            const selectedRadio = document.querySelector(".radio-area.selected");
            if(selectedRadio != null) selectedRadio.classList.remove("selected");
            container.classList.add("selected");
        }
    },
    cursor: {
        cursorElm: document.querySelector(".cursor"),
        cursorSmallElm: document.querySelector(".cursor .cursor-small"),
        cursorBigElm: document.querySelector(".cursor .cursor-big"),
        /**
         * 
         * @param {Element} elm 
         */
        hoverables: (elm) => {
            elm.addEventListener("mouseenter", Page.cursor.hover);
            elm.addEventListener("mouseleave", Page.cursor.hover);
        },
        /**
         * 
         * @param {MouseEvent} ev 
         */
        move: (ev) => {
            const cursorSmall = Page.cursor.cursorSmallElm;
            const cursorBig = Page.cursor.cursorBigElm;
            const x = ev.pageX;
            const y = ev.pageY;

            gsap.to(cursorSmall, {x, y, duration: .1});
            gsap.to(cursorBig, {
                x,
                y,
                duration: .5
            }).timeScale(2);

            const greenCan = document.querySelector('.lata-verde');
            const greenBox = document.querySelector('.caixa-verde');
            const pinkCan = document.querySelector('.lata-rosa');
            const pinkBox = document.querySelector('.caixa-rosa');
            
            const pinkCanTop = 16;
            const pinkCanLeft = 43;
            const greenCanTop = 18;
            const greenCanLeft = 28;

            const pinkBoxTop = 48;
            const pinkBoxLeft = 10;
            const greenBoxTop = 48;
            const greenBoxLeft = 37;

            gsap.to(pinkCan, {
                left: `${pinkCanLeft + (6/100) * ((x/Page.width) * 100)}%`,
                top: `${pinkCanTop - (6/100) * ((y/Page.width) * 100)}%`
            });
            gsap.to(greenCan, {
                left: `${greenCanLeft - (6/100) * ((x/Page.width) * 100)}%`,
                top: `${greenCanTop + (6/100) * ((y/Page.width) * 100)}%`
            });
            gsap.to(greenBox, {
                left: `${greenBoxLeft - (4/100) * ((x/Page.width) * 100)}%`,
                top: `${greenBoxTop - (4/100) * ((y/Page.width) * 100)}%`
            });
            gsap.to(pinkBox, {
                left: `${pinkBoxLeft + (4/100) * ((x/Page.width) * 100)}%`,
                top: `${pinkBoxTop + (4/100) * ((y/Page.width) * 100)}%`
            });
            console.log(Math.floor((8/100) * ((y/Page.height) * 100)));
        },
        /**
         * 
         * @param {MouseEvent} ev 
         */
        hover: (ev) => {
            const cursorBig = Page.cursor.cursorBigElm;
            const scale = (ev.type == "mouseenter") ? "60px" : "30px";
            const margin = (ev.type == "mouseenter") ? "-26px" : "-12px";
            gsap.to(cursorBig, {width: scale, height: scale, top: margin, left: margin, duration: .2});
        }
    },
    select: {
        register: () => {
            document.querySelectorAll(".select-box").forEach(elm => Page.select.events.register(elm));
        },
        /**
         * 
         * @param {Element} elm 
         */
        events: {
            register: (elm) =>{ 
                elm.addEventListener("click", Page.select.events.click);
                elm.querySelector("input").addEventListener("input",Page.select.events.filter);
                elm.querySelectorAll("li").forEach(elm => elm.addEventListener("click", Page.select.events.select));
                document.addEventListener("click", Page.select.events.disableAllSelects);
            },
            disableAllSelects: (ev) => {
                const target = ev.target;
                let elm = target;
                let disable = false;
                do {
                    elm = elm.parentElement;

                    if(elm.parentElement != null && elm.classList.contains("select-box")) {
                        disable = true;
                    }
                } while (elm != null && elm.parentElement != null && !elm.classList.contains("select-box") && !disable);


                if(!disable) {
                    document.querySelectorAll(".options").forEach(elm => elm.classList.remove("selected"));
                }
            },
            /**
             * 
             * @param {MouseEvent} ev 
             */
            click: (ev) => {
                const target = ev.target;
                let container = target;
                if(!container.classList.contains("select-box")) {
                    do {
                        container = container.parentElement;
                    } while (!container.classList.contains("select-box") || container.parentElement == null);
                }
                document.querySelectorAll(".options.selected").forEach(elm => elm.classList.remove("selected"));
                container.querySelector(".options").classList.toggle("selected");
            },
            filter: (ev) => {
                const target = ev.target;
                let select = target;
                if(!select.classList.contains("select-box")) {
                    do {
                        select = select.parentElement;
                    } while (!select.classList.contains("select-box"));
                }

                const options = select.querySelectorAll("li");
                const filteredOptions = Array.from(options).filter(li => li.textContent.toLowerCase().startsWith(target.value.toLowerCase()));

                options.forEach(elm => elm.classList.add("hidden"));
                filteredOptions.forEach(elm => elm.classList.remove("hidden"));
                
            },
            select: (ev) => {
                const target = ev.target;
                let select = target;

                if(!select.classList.contains("select-box")) {
                    do {
                        select = select.parentElement;
                    } while (!select.classList.contains("select-box"));
                }

                const selectedOption = select.querySelector("li.selected");
    
                if(selectedOption != null) selectedOption.classList.remove("selected");
                target.classList.add("selected");

                const options = select.querySelectorAll("li");
                options.forEach(elm => elm.classList.remove("hidden"));


                select.querySelector("input[type='text']").value = target.innerText;
                select.querySelector("input[type='hidden']").value = target.getAttribute("data-value");

            }
        }
    },
    ibge: {
        states: () => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
              };
              
              fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    const select = document.querySelector("ul.options.state")
                    result.map(s => {
                        const li = document.createElement("li");
                        li.setAttribute("data-value", s.sigla);
                        li.innerText = s.nome;
                        select.appendChild(li);
                        li.addEventListener("click", Page.select.events.select);
                        li.addEventListener("click", Page.ibge.cities);
                    })
                })
                .catch((error) => console.error(error));
        },
        cities: (ev) => {
            const uf = ev.target.getAttribute("data-value");
            console.log(uf);
            const select = document.querySelector("ul.options.city")
            select.innerHTML = "";
            
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result)
                    result.map(c => {
                        const li = document.createElement("li");
                        li.setAttribute("data-value", c.nome);
                        li.innerText = c.nome;
                        select.appendChild(li);
                        li.addEventListener("click", Page.select.events.select);
                    })
                })
                .catch((error) => console.error(error));
        }
    },
}

Page.init();