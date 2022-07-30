class Input{
    constructor(){
        this.keys = []
        window.addEventListener("keydown",(event) => {
            this.keys[event.key] = true
            event.preventDefault()
        })

        window.addEventListener("keyup",(event) => {
            this.keys[event.key] = false
            event.preventDefault()
        })
    }
    getKeyStatus(key = 'e'){
        return this.keys[key]
    }
}