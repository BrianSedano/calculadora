window.addEventListener("load", () => {
    var arrnum = "0123456789,"
    var op = "/*+-"
    var cancel = ["1/x", "x^2", "2√x", "/", "*", "-", "+", "+/-", ",", "%"]

    var buttons = document.getElementsByClassName("button")
    var input = document.querySelector(".input").querySelector(".text")
    var prev = document.querySelector(".prev").querySelector(".text")
    var holder = document.body.querySelector(".main").querySelector(".history").querySelector(".holder")

    var trash = document.querySelector(".main").querySelector(".history").querySelector(".trash")
    var trash_img = trash.querySelector(".trash-img")

    var calc = false
    var res = false

    var lerp = (a, b, u) => {
        u = u < 0 ? 0 : u;
        u = u > 1 ? 1 : u;
        return a + (b - a) * u;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var addNum = (num) => {
        var inner = input.innerHTML
        if (inner.length == 15) { return }
        if (res) {
            res = false
            prev.innerHTML = ""
            input.innerHTML = num
        } else {
            if (inner == "0") {
                input.innerHTML = num
            } else {
                var string = `${inner}${num}`
                var tf = null
                if (string.includes(",") && !string.split(",")[1]) {
                    input.innerHTML = string
                } else {
                    tf = string.split(".").join("").split(",").join(".")
                    input.innerHTML = (parseFloat(tf)).toLocaleString('pt-BR')
                }
            }
        }
    }
    var remNum = () => {
        var inner = input.innerHTML
        if (res) {
            res = false
            prev.innerHTML = ""
        } else {
            if (inner.length == 1) {
                input.innerHTML = 0
            } else {
                var string = inner.substring(0, inner.length - 1)
                if (string.includes(",") && !string.split(",")[1]) {
                    input.innerHTML = (parseFloat(string)).toLocaleString('pt-BR')
                } else {
                    input.innerHTML = string
                }
            }
        }
    }

    var perc = (array, percent) => {
        let Inted = [parseInt(array[0]), parseInt(array[1]), parseInt(array[2])]
        let r = Inted[0] + (((255 - Inted[0]) * percent) / 100)
        let g = Inted[1] + (((255 - Inted[1]) * percent) / 100)
        let b = Inted[2] + (((255 - Inted[2]) * percent) / 100)
        return `rgb(${r},${g},${b})`
    }

    var InvalidHandler = (color) => {
        for (const key in buttons) {
            let value = buttons[key]
            if (typeof value == "object") {
                let t = value.querySelector(".text")
                if (cancel.includes(t.innerHTML)) {
                    t.style.color = `rgb(${color},${color},${color})`
                }
            }
        }
    }

    var calcRes = () => {
        var p = prev.innerHTML
        var i = input.innerHTML
        if (p.includes("%")) {
            let percent = p.split("%")[0].split(".").join("").split(",").join(".")
            return ((parseFloat(percent) * parseFloat(i)) / 100).toLocaleString("pt-BR")
        } else {
            i = i.split(".").join("").split(",").join(".")
            if (!p.includes("e")) {
                p = p.split(".").join("").split(",").join(".")
            }

            var res = eval(`${p}(${i})`)
            if (res.toString().includes("e")) {
                return res
            }
            if (isNaN(res) || res == "Infinity") { return false } else { return (res).toLocaleString('pt-BR') }
        }
    }

    var opCalc = (a) => {
        var prevTxt = input.innerHTML
        if (!prevTxt.split(",")[1]) {
            prevTxt = prevTxt.split(",")[0]
        }
        if (!calc) {
            res = false
            calc = true
            prev.innerHTML = `${prevTxt} ${a}`
            input.innerHTML = "0"
        } else {
            if (!calcRes()) {
                prev.innerHTML = ""
                input.innerHTML = "Invalid Value"
                InvalidHandler(140)
            } else {
                addHistory(`${prev.innerHTML} ${input.innerHTML} =`, calcRes())
                prev.innerHTML = `${calcRes()} ${a}`
                input.innerHTML = "0"
            }
        }
    }

    var equalCalc = () => {
        calc = false
        res = true
        var p = prev.innerHTML
        var innerTxt = input.innerHTML

        if (p.includes("=")) { return }

        if (!innerTxt.split(",")[1]) {
            innerTxt = innerTxt.split(",")[0]
        }
        if (innerTxt.includes("-")) {
            innerTxt = `(${innerTxt})`
        }
        if (!calcRes()) {
            prev.innerHTML = ""
            input.innerHTML = "Invalid Value"
            InvalidHandler(140)
        } else {
            input.innerHTML = calcRes()
            prev.innerHTML = `${p} ${innerTxt} =`
            addHistory(prev.innerHTML, input.innerHTML)
        }
    }

    var addHistory = (p, i) => {

        let div = document.createElement("div")
        div.classList.add("hist-div")

        let top = document.createElement("p")
        top.classList.add("hist-pTop")
        let cont = document.createTextNode(p)
        top.appendChild(cont)
        div.appendChild(top)

        let bottom = document.createElement("p")
        bottom.classList.add("hist-pBottom")
        cont = document.createTextNode(i)
        bottom.appendChild(cont)
        div.appendChild(bottom)

        if (holder.querySelector(".no-hist")) {
            trash.style.height = `8%`
            holder.querySelector(".no-hist").remove()
        }
        holder.appendChild(div)
    }



    var anims = {}

    window.addEventListener("keydown", async(e) => {
        let inp = false
        let cont = ""

        if (input.innerHTML.match("Invalid Value")) {
            prev.innerHTML = ""
            input.innerHTML = 0
            return
        }
        if (arrnum.includes(e.key)) {
            addNum(e.key)

            inp = true
            cont = e.key
        } else if (op.includes(e.key)) {
            opCalc(e.key)

            inp = true
            cont = e.key
        } else if (e.key == "Backspace") {
            remNum()

            inp = true
            cont = "DELETE"
        } else if (e.key == "Enter") {
            equalCalc()

            inp = true
            cont = "="
        } else if (e.key == "%") {
            res = false
            calc = true
            prev.innerHTML = `${input.innerHTML}% of`
            input.innerHTML = "0"

            inp = true
            cont = e.key
        } else if (e.key == "Delete") {
            input.innerHTML = "0"

            inp = true
            cont = "CE"
        } else if (e.key == "Escape") {
            input.innerHTML = "0"
            prev.innerHTML = ""
            res = false
            calc = false

            inp = true
            cont = "C"
        }
        if (inp) {
            for (const key in buttons) {
                let n = buttons[key]
                if (typeof n == "object" && n.querySelector(".text").innerHTML == cont) {
                    let or = n.style.backgroundColor
                    let splitted = or.substring(4, or.length - 1).split(",")
                    let newColor = perc(splitted, 20)
                    n.style.backgroundColor = newColor
                    await sleep(30)
                    n.style.backgroundColor = or
                }
            }
        }
    })

    for (const v in buttons) {
        anims[v] = null
        let value = buttons[v]
        let or = null
        let hover = null
        if (typeof value == "object") {
            let text = value.querySelector(".text").innerHTML

            value.onmousedown = () => {
                if (input.innerHTML.match("Invalid Value") && cancel.includes(text)) { return }
                let splitted = hover.substring(4, hover.length - 1).split(",")
                let newColor = perc(splitted, 15)
                value.style.backgroundColor = newColor
            }
            value.onmouseup = () => {
                if (input.innerHTML.match("Invalid Value") && cancel.includes(text)) { return }
                value.style.backgroundColor = hover
            }
            value.onmouseenter = () => {
                if (input.innerHTML.match("Invalid Value") && cancel.includes(text)) { return }
                if (!or) {
                    or = value.style.backgroundColor
                }
                let splitted = or.substring(4, or.length - 1).split(",")
                let newColor = perc(splitted, 20)
                hover = newColor
                value.style.backgroundColor = newColor
            }
            value.onmouseleave = () => {
                if (input.innerHTML.match("Invalid Value") && cancel.includes(text)) { return }
                value.style.backgroundColor = or
            }
            value.onclick = async() => {
                if (input.innerHTML.match("Invalid Value") && !cancel.includes(text)) {
                    prev.innerHTML = ""
                    input.innerHTML = 0
                    InvalidHandler(255)
                    return
                } else if (input.innerHTML.match("Invalid Value")) { return }
                if (arrnum.includes(text)) {
                    addNum(text)
                } else if (text.match("DELETE")) {
                    remNum()
                } else if (text.match("CE")) {
                    input.innerHTML = "0"
                } else if (text.match("C")) {
                    input.innerHTML = "0"
                    prev.innerHTML = ""
                    res = false
                    calc = false
                } else if (op.includes(text)) {
                    opCalc(text)
                } else if (text.match("1/x")) {
                    res = true
                    if (input.innerHTML == "0") {
                        input.innerHTML = "Invalid Value"
                        prev.innerHTML = ""
                        return
                    }
                    prev.innerHTML = `1/(${input.innerHTML})`
                    let transform = input.innerHTML.split(".").join("").split(",").join(".")
                    input.innerHTML = (1 / parseFloat(transform)).toLocaleString('pt-BR')
                } else if (text == "2√x") {
                    res = true
                    prev.innerHTML = `2√(${input.innerHTML})`
                    let transform = input.innerHTML.split(".").join("").split(",").join(".")
                    input.innerHTML = Math.sqrt(parseFloat(transform)).toLocaleString('pt-BR')
                } else if (text == "x^2") {
                    res = true
                    prev.innerHTML = `(${input.innerHTML})^2`
                    let transform = input.innerHTML.split(".").join("").split(",").join(".")
                    let final = parseFloat(transform)
                    console.log(final)
                    for (let i = 1; i < 2; i++) {
                        final *= parseFloat(transform)
                    }
                    input.innerHTML = (final).toLocaleString('pt-BR')
                } else if (text.match("=") && calc) {
                    equalCalc()
                } else if (text.match("%") && !calc && input.innerHTML != "") {
                    res = false
                    calc = true
                    prev.innerHTML = `${input.innerHTML}% of`
                    input.innerHTML = "0"
                } else if (text == "+/-" && !input.innerHTML.match("0")) {
                    var i = input.innerHTML
                    if (!i.includes("-")) {
                        input.innerHTML = `-${i}`
                    } else {
                        input.innerHTML = i.split("-")[1]
                    }
                }
            }
        }
    }

    trash_img.onmouseenter = () => { trash_img.style.backgroundColor = `rgb(140,140,140)` }
    trash_img.onmouseleave = () => { trash_img.style.backgroundColor = `rgb(65,65,65)` }
    trash_img.onmousedown = () => { trash_img.style.backgroundColor = `rgb(190,190,190)` }
    trash_img.onmouseup = () => {
        trash_img.style.backgroundColor = `rgb(140,140,140)`
        holder.querySelectorAll('*').forEach(n => n.remove())

        trash.style.height = `0%`
        trash.style.opacity = `1`
        let nohist = document.createElement("p")
        nohist.classList.add("no-hist")
        nohist.appendChild(document.createTextNode("Ainda não há histórico"))
        holder.appendChild(nohist)
    }
})