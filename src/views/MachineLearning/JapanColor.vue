<template>
  <div>
    <h1>Let's train traditional Japanese colors</h1>
    <section>
      <button class="pure-button" @click="run">Run</button>
      <button class="pure-button" @click="run_10_epochs">10 epochs</button>
      <button class="pure-button" @click="run_100_epochs">100 epochs</button>
      <canvas id="NN" width="1000" height="600"></canvas>

      <div>
      </div>
    </section>
  </div>
</template>

<script>
import Mixin from '@/components/Common'
export default {
  mixins:[Mixin],
  data(){
    return{
      colors: this.colors,
      input_nodes: 6,
      output_nodes: 4,
      nodes: this.nodes,
      neurons: this.neurons,
      links: this.links,
      learning_rate: this.learning_rate,
      phase: this.phase,
      number: this.number,
      neuron_inputs: this.neuron_inputs,
      neuron_outputs: this.neuron_outputs,
    }
  },
  mounted(){
    this.init()

    //this.calc_go()
  },
  methods:{
    calc_go(){
//console.log(this.number)
      const n = this.number
      const depth = this.depth
      const d = depth.abs() - 1
      const in_node = d === 0 ? this.inputs[n] : this.neuron_outputs[d-1]
      const out_node = d === this.nodes.length ? this.targets[n] : this.neuron_outputs[d]
//console.log(in_node, out_node, d, this.neuron_outputs)
//console.log(this.depth, d)
      if(depth > 0){
        this.neuron_inputs[d] = in_node.matrix(this.links[d])
//console.log(in_node, this.links[d], this.neuron_inputs[d])
        switch(this.activation_type){
          case 'relu':
            this.neuron_outputs[d] = this.neuron_inputs[d].relu()
            break

          default:
            this.neuron_outputs[d] = this.neuron_inputs[d].sigmoid()
        }
//console.log(this.neuron_outputs)
        if(d === this.nodes.length) this.depth *= -1
        else this.depth++
      }

      else if(depth < 0){
        const neuron_inputs = this.neuron_inputs[d]
        const neuron_outputs = this.neuron_outputs[d]
        const neuron_errors = d === this.nodes.length ? out_node.diff(neuron_outputs.T()) : this.links[d+1].matrix(this.neuron_errors[d+1])

        let neuron_diff = neuron_errors
        switch(this.activation_type){
          case 'relu':
            neuron_diff = neuron_diff.multiple(neuron_inputs.T().sigmoid_derivative())
            break
          default:
            neuron_diff = neuron_diff.multiple(neuron_inputs.T().relu_derivative())
        }
        neuron_diff = neuron_diff.matrix(in_node)
                                  .multiple(this.learning_rate)

//console.log(this.links[d])
        this.links[d] = this.links[d].add(neuron_diff.T())
//console.log(this.links[d])
        this.neuron_errors[d] = neuron_errors

//console.log(neuron_errors, neuron_inputs, neuron_inputs.T().sigmoid_derivative(),  in_node, neuron_diff)
//console.log(this.number, this.depth)
        if(this.depth === -1){
          this.depth = 1
          
          if(this.number >= this.inputs.length-1) this.number = 0
          else this.number++
        }
        else this.depth++
      }

      this.draw()
    },

    draw(){
      const canvas = this.$$('#NN')
      const ctx = canvas.getContext('2d')
      const answers = ['Spring', 'Summer', 'Autumn', 'Winter']
      const n = this.number
      ctx.font = '14px serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1

      if(ctx.getTransform().e === 0){
        //原点調整
        ctx.translate(500, 300)
      }
      else{
        //クリア
        ctx.clearRect(-500, -300, canvas.width, canvas.height)
      }
//console.log(n, this.inputs)
      const inputs = this.inputs[n][0]

      const xy = []
      xy.push([])
      inputs.forEach((v,i)=>{
        xy[0].push([-400, -100+15+34*i])
      })
      
      this.nodes.forEach((v,i)=>{
        xy.push([])
        Array(v).fill([]).forEach((vv,ii)=>{
          const x = -400 + 800 * (i+1) / (this.nodes.length+1)
          const y = -260 + 520 * ii / (v-1) 
          xy[xy.length-1].push([x, y])
        })
      })

      xy.push([])
      answers.forEach((v,i)=>{
        xy[xy.length-1].push([400, -260+65+130*i])
      })
//console.log(this.links, xy)
      //リンク
      this.links.forEach((links, l)=>{
        if(l >= this.links.length) return

        links.forEach((row, row_i)=>{
          row.forEach((col, col_i)=>{
            const val = row[col_i]
            const x1 = xy[l][row_i][0]
            const y1 = xy[l][row_i][1]
            const x2 = xy[l+1][col_i][0]
            const y2 = xy[l+1][col_i][1]

            ctx.lineWidth = 5 ** (1 / (1 + Math.E ** (-val)) * 2 - 1)
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          })
        })
      })

      ctx.lineWidth = 1

      //input
      ctx.beginPath()
      ctx.fillStyle = inputs.slice(0,3).str()
      ctx.rect(-495, -100, 100, 100)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.fillStyle = inputs.slice(3,6).str()
      ctx.rect(-495, 0, 100, 100)
      ctx.fill()
      ctx.stroke()

      inputs.forEach((v,i)=>{
        const color = [0,0,0]
        color[i%3] = v

        circle(-400, -100+15+34*i, color)
      })


//console.log(this.neuron_outputs)
      //ニューロン
      xy.forEach((v,d)=>{
        if(d===0) return
        v.forEach((xy,i)=>{
          const score = this.neuron_outputs[d-1] ? this.neuron_outputs[d-1][0][i] * 200 : 0 //200はてきとう
          const color = Array(3).fill(score)
          circle(xy[0], xy[1], color)
        })
      })

      answers.forEach((v,i)=>{
        const y = -260+65+130*i
        const score = this.neuron_outputs[this.neuron_outputs.length-1] ? this.neuron_outputs[this.neuron_outputs.length-1][0][i] : 0
        //const color = Array(3).fill(score)
        //circle(400, y, color)
        ctx.fillStyle = this.targets[n][i][0] ? '#00c968' : '#000'
        ctx.fillText(v, 430, y)
        ctx.fillText(score, 430, y+20)
      })

      function circle(x, y, color){
        ctx.beginPath()
        ctx.fillStyle = color.str()
//console.log(ctx.fillStyle, color.str())
        ctx.arc(x, y, 15, 0, Math.PI * 2, true)
        ctx.fill()
        ctx.stroke()
      }
    },

    init(){
      this.number = 0
      this.depth = 1
      this.nodes = [3,3]
      this.learning_rate = 0.1
      this.activation_type = 'relu'
      //参考
      //https://www.color-sample.com/colorschemes/japanese/autumn/
      //https://color-pallet.spark-a.com/kasane-iromoku-fuyu/
      //https://costume.iz2.or.jp/color/mix.html
      this.colors = [
        ['Ume','梅',1,252,250,245,98,22,46],
        ['Umegasane',' 梅重',1,180,9,38,249,130,137],
        ['Wakakusa','若草',1,41,144,94,38,74,46],
        ['Kiyanagi','黄柳',1,230,236,46,45,84,52],
        ['Sumire','菫',1,105,39,85,135,77,161],

        ['Unohana','卯花',2,252,250,245,45,84,52],
        ['Kaede','蝦手',2,45,84,52,45,84,52],
        ['Wakakaede','若蝦手',2,41,144,94,201,9,38],
        ['Kakitubata','杜若',2,143,201,71,252,190,193],
        ['Yuri','百合',2,232,39,39,215,173,16],

        ['Hagi','萩',3,105,39,85,252,250,245],
        ['Hagitateao','萩縦青',3,96,28,48,45,84,52],
        ['Hanasusuki','花薄',3,252,250,245,46,106,135],
        ['Kuchiba','朽葉',3,180,9,38,237,185,24],
        ['Ominaeshi','女郎花',3,219,230,40,45,84,52],

        ['Kareno','枯野',4,255,239,32,41,144,94],
        ['Kareiro','枯色',4,224,176,128,45,84,52],
        ['Koori','氷',4,252,250,245,252,250,245],
        ['Tubaki','椿',4,98,22,46,232,39,39],
        ['Koke','苔',4,158,92,70,66,59,78],

        // ['Matugasane','松重',0,45,84,52,105,39,85],
        // ['Shisokuiro','脂燭色',0,105,39,85,201,9,38],
        // ['Imayouiro','今様色',0,249,130,137,73,16,34],
        // ['Kuzu','葛',0,45,84,52,41,144,94],
        // ['Kurenainonioi','紅匂',0,201,9,38,201,9,38],
        //['','',,],
      ]

      this.inputs = []
      this.targets = []
      this.neuron_inputs = []
      this.neuron_outputs = []
      this.neuron_errors = Array(this.nodes.length)
      this.names = []
      this.colors.forEach((v)=>{
        const colors = v.slice(3,9).map(c=>c/255*0.99+0.01)
        this.inputs.push([colors])
        this.targets.push([[0],[0],[0],[0]])
        this.targets[this.targets.length-1][v[2]-1][0] = 1
        this.names.push({e:v[0], j:v[1]})
      })

      this.links = []
      for(let i=-1; i<this.nodes.length; i++){
        const links = []
        const row = i === -1 ? this.input_nodes : this.nodes[i]
        const col = i === this.nodes.length - 1 ? this.output_nodes : this.nodes[i+1]
        for(let r=0; r<row; r++){
          links[r] = []
          for(let c=0; c<col; c++){
            links[r][c] = Math.random() - 0.5
          }
        }
        this.links.push(links)
      }
console.log(this.links)
      this.draw()
    },

    run(){
      this.phase = 'go'

      switch(this.phase){
        case 'go': this.calc_go(); break
      }
    },

    run_10_epochs(){
      const num = 10 * (this.nodes.length + 1) * 2 * this.colors.length
      for(let i=0; i<num; i++){
        this.calc_go()
      }
    },

    run_100_epochs(){
      const num = 100 * (this.nodes.length + 1) * 2 * this.colors.length
      for(let i=0; i<num; i++){
        this.calc_go()
      }
    },
  }
}
</script>

<style>
#NN{
    max-width: 100%;
}
</style>