const randInt = function(max){
    return Math.floor(Math.random()*(max+1))
}

let app = new Vue({
    el: '#app',
    data: {
        sample:'',
        answer: '',
        operIndex: 0,
        mark: { text: '', style: '' },
        result: 0,
        results: [],
        operations: [
            { action: '+', result(a, b){ return a+b }, create(){return {a: randInt(100), b: randInt(100)}} },
            { action: '-', result(a, b){ return a-b },
                create(){
                    const a = randInt(100)
                    const b = randInt(100)
                    if (a>=b) return { a: a, b: b }
                    else return { a: b, b: a }
                } },
            { action: '*', result(a, b){ return a*b },
                create(){
                    const a = randInt(10)
                    const b = randInt(99)
                    if (randInt(1) === 1) return { a: a, b: b }
                    else return { a: b, b: a }
                } },
            { action: ':', result(a, b){ return a/b },
                create(){
                    const a = randInt(29) + 1
                    const b = randInt(9) + 1
                    const c = a*b
                    if (randInt(1) === 1) return { a: c, b: a }
                    else return { a: c, b: b }
                } },
        ]
    },
    computed: {
        lastNum(){
            if(this.results[0])  return this.results[0].number+1
            else return 1
        }

    },
    methods: {
        atStart(){
            this.chooseOperation()
            this.setSample()
            this.answer = ''
            this.results = JSON.parse(localStorage.getItem('results')) || []
        },
        chooseOperation(){
            this.operIndex = randInt(3)
        },
        setSample(){
            const operation = this.operations[this.operIndex]
            const {a, b} = operation.create()
            this.result = operation.result(a,b)
            this.sample = `${a} ${operation.action} ${b}`
        },
        typeAnswer(){
            let replacer = ('').match('')
            if((/[0-9]{0,3}/).test(this.answer)) {
                replacer = this.answer.match(/[0-9]{0,3}/)
            }
            this.answer = replacer
        },
        check(){
            if(this.answer){
                let newRes = {
                    number: this.lastNum,
                    sample: this.sample,
                    answer: this.answer.toString(),
                    result: this.result,
                    mark: '',
                    answerStyle: ''
                }
                if (parseInt(this.answer) === this.result) {
                    this.mark.text = `Верно :D ${this.sample} = ${this.answer}`
                    this.mark.style = newRes.answerStyle = 'text-success'
                    newRes.mark = 'Верно :D'
                } else {
                    this.mark.text = `Неверно :( ${this.sample} = ${this.result}, а твой ответ - ${this.answer}`
                    this.mark.style = newRes.answerStyle = 'text-danger'
                    newRes.mark = 'Неверно :С'
                }
                this.results.unshift(newRes)
                localStorage.setItem('results', JSON.stringify(this.results.slice(0,50)))
                this.atStart()
            }
        }
    },
    mounted(){
        this.atStart()
    }

})
