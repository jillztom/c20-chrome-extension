<template>
  <div class="container" v-if="nav && currencies">
    
    <div class="field-area">
      <div class="area">
        <h2 class="nav">{{ nav }}</h2>
        <h4>Nav Price</h4>
      </div>
      <div class="area">
        <h2 class="nav">
          <input type="text" v-model="c20">
        </h2>
        <h4>Tokens</h4>
      </div>
      <div class="area">
        <h2 class="portfolio">{{ Number(total).toLocaleString('en-US', { style: 'currency', currency: base}) }}</h2> 
        <h4>Portfolio</h4>
      </div>
    </div>
    <hr>
      <div class="movements">
        <div class="items" v-for="(item, index) in movements"> 
          <span :class="{'up': (item > 0), 'down': (item < 0)}">
            {{ index }} 
            <i class="fa fa-arrow-up" v-if="item > 0"></i>
            <i class="fa fa-arrow-down" v-if="item < 0"></i>
          </span>  
          <span :class="{'up': (item > 0), 'down': (item < 0)}">{{ item }}%</span>
        </div>
      </div>
    <hr>
    <div class="footer-area">
      <p>{{ (nav / .95).toFixed(2) * 100  }}% increase from ICO</p> 
      <div
        <button type="button" @click.prevent="saveToken()"><i class="fa fa-floppy-o"></i> </button>
        <button type="button" @click.prevent="getC20()"><i class="fa fa-refresh"></i> </button>
        <select v-model="base" v-if="currencies">
          <option v-for="(item, index) in currencies">{{ index }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        nav: 0,
        c20: 1500,
        currencies: null,
        movements: null,
        base: 'USD',
      }
    },
    mounted(){
      this.getRates();
      this.getC20();
    },
    
    watch: {
      base(){
        localStorage.setItem('c20Base', this.base);
      }
    },
    
    computed:{
      total(){
        return (this.nav * this.c20 * this.currencies[this.base]).toFixed(2);
      }
    },
    
    methods: {
      getRates(){
        axios.get('https://api.fixer.io/latest?base=USD').then((res)=>{
          this.currencies = res.data.rates;
          this.currencies.USD = 1;
        })
      },
      
      getC20(){
        if(localStorage.getItem('c20Token')){
          this.c20 = localStorage.getItem('c20Token');
        }
        if(localStorage.getItem('c20Base')){
          this.base = localStorage.getItem('c20Base');
        }
        axios.get('https://crypto20.com/status').then((res)=>{
          this.nav = res.data.nav_per_token;
        })
        
        axios.get('https://crypto20.com/api/v1/funds/movements').then((res)=>{
          this.movements = res.data;
        })
        
      },
      
      saveToken(){
        localStorage.setItem('c20Token', this.c20);
      },
    },
  }
</script>

<style lang="scss" scoped>

  .movements{
    display: flex;    
    width: 100%;
    justify-content: space-between;
  }
  .movements .items{
    display: flex;
    flex-direction: column;
  }
  .movements .items span{
    font-weight: 600;
  }
  .movements .items span.up{
    color: #6cb305;
  }
  .movements .items span.down{
    color: #eb703a;
  }
  .footer-area{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer-area p{
    padding: 5px 0;
    margin: 5px;
    text-align: center;
    font-size: 12px;
    white-space: nowrap;
  }
  .footer-area button{
    margin: 0 2px;
  }
  p {
    font-size: 16px;
  }
  .container{
    // width: 250px;
    padding: 10px;
    background: #f9f9f9;
  }
  .field-area{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }
  h2, h4{
    margin: 0;
    padding: 0;
  }
  h2.nav{
    font-size: 20px;
    color: #2595ff;
  }
  h2.portfolio{
    color: #6cb305;
  }
  h4{
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 1px;
    white-space: nowrap;
  }
  .field-area .area{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .field-area input{
    width: 100px;
    margin: 0;
    border: 0;
    font-size: 20px;
    text-align: center;
    font-weight: 600;
    background: none;
  }
  hr{
    border: 0;
    border-bottom: 1px dashed #ccc;
    background: #fff;
  }
</style>
