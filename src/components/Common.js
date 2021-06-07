export default{
  created(){
    Number.prototype.abs = function(){
      return Math.abs(this)
    }

    String.prototype.abs = function(){
      return parseFloat(this).abs()
    }

    Number.prototype.float = function(){
      return parseFloat(this)
    }

    String.prototype.float = function(){
      return parseFloat(this)
    }

    Number.prototype.int = function(){
      return parseInt(this)
    }

    String.prototype.int = function(){
      return parseInt(this)
    }

    Number.prototype.intAbs = function(){
      return Math.abs(this).int()
    }

    String.prototype.intAbs = function(){
      return parseFloat(this).intAbs()
    }

    Array.prototype.T = function(){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let c=0; c<col; c++){
        res[c] = []
        for(let r=0; r<row; r++){
          res[c][r] = this[r][c]
        }
      }
      return res
    }

    Array.prototype.add = function(array){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
          res[r][c] = this[r][c] + array[r][c]
        }
      }

      return res
    }

    Array.prototype.multiple = function(val){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
          if(typeof val === 'object'){
            res[r][c] = this[r][c] * val[r][c]
          }
          else{
            res[r][c] = this[r][c] * val
          }
        }
      }

      return res
    }

    Array.prototype.diff = function(array){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
          res[r][c] = this[r][c] - array[r][c]
        }
      }

      return res
    }

    Array.prototype.matrix = function(array){
      const row = this.length
      const col = array[0].length
      const res = new Array(row)

      for(let a=0; a<row; a++){
        res[a] = new Array(col) 

        for(let b=0; b<col; b++){
          res[a][b] = 0
          for(let i=0; i<this[0].length; i++){
            res[a][b] += this[a][i] * array[i][b]
          }
        }
      }
      return res
    }

    Array.prototype.relu = function(){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
          res[r][c] = this[r][c] > 0 ? this[r][c] : 0
        }
      }

      return res
    }

    Array.prototype.relu_derivative = function(){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
           res[r][c] = this[r][c] ? 1 : 0
        }
      }

      return res
    }

    Array.prototype.sigmoid = function(){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
          res[r][c] = 1 / (1 + Math.E ** (-this[r][c]))
        }
      }

      return res
    }

    Array.prototype.sigmoid_derivative = function(){
      const res = new Array()
      const row = this.length
      const col = this[0].length
      for(let r=0; r<row; r++){
        res[r] = []
        for(let c=0; c<col; c++){
           const sigmoid = 1 / (1 + Math.E ** (-this[r][c]))
           res[r][c] = sigmoid * (1 - sigmoid)
        }
      }

      return res
    }

    Array.prototype.str = function(){
      let r = this[0]
      let g = this[1]
      let b = this[2]
      let border = 1.01

      if(r < border && g < border && b < border){
        r *= 255
        g *= 255
        b *= 255
      }

      return 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    Number.prototype.zeroPadding = function(digit){
      var zero = "";
      for(var i=1; i<digit; i++){
        zero += "0";
      }
      return (zero + this).substr(-digit);
    }

    String.prototype.zeroPadding = function(digit){
      return this.int().zeroPadding(digit)
    }

  },
  mounted(){

  },

  methods: {
    $$(selector){
      return document.querySelector(selector);
    },

    $$$(selector){
      return document.querySelectorAll(selector);
    },
  }
}
