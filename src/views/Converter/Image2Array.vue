<template>
  <div>
    <h1>Image to Array</h1>
    <section>
      <input @change="select_file" ref="file" type="file" />
      <button class="pure-button" @click="run">Run</button><br>
      <canvas id="canvas" :width="w" :height="h"></canvas>

      <div id="code">{{code}}</div>
    </section>
  </div>
</template>

<script>
import Mixin from '@/components/Common'
export default {
  mixins:[Mixin],
  data(){
    return{
      h: this.h,
      w: this.w,
      code: this.code,
    }
  },
  mounted(){
    this.w = 28
    this.h = 28
  },
  methods:{
    select_file(e){
      this.files = e.target.files || e.dataTransfer.files
      
    },

    run(){
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      const _this = this
      const w = _this.w
      img.src = URL.createObjectURL(this.files[0])
//console.log(img, this.files)
      img.onload = function(){
        ctx.drawImage(img, 0, 0, w, this.height * (w / this.width))
        let data = ctx.getImageData(0, 0, 28, 28).data

        const res = []
        for(let i=0; i<data.length; i+=4){
          const val = ((data[i] + data[i+1] + data[i+2]) / 3).int()
          res.push(val)
        }
console.log(res)
        _this.code = JSON.stringify(res)
      }
    },
  }
}
</script>

<style>
#canvas{
    min-width: 100px;
}
#code{
    background: #eee;
    word-break: break-word;
    padding: 20px;
}
</style>