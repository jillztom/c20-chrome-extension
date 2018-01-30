<template>
  <div class="container" v-if="nav && currencies">
    <div class="edit-button">
      <i class="fa fa-gear" v-if="!edit" @click="edit=true"></i>
    </div>
    <div class="portfolio-total">
      <p> My Total Asset Value in Exchange  </p>
      <h2 class="portfolio">{{ Number(exchangeTotal).toLocaleString('en-US', { style: 'currency', currency: base}) }}</h2>
      <p> 24hr Change  </p>
      <h3 :class="{'up': (exchangeInfo.percent_change_24h > 0), 'down': (exchangeInfo.percent_change_24h < 0)}">
        {{ exchangeInfo.percent_change_24h }}%
          <i class="fa fa-arrow-up" v-if="exchangeInfo.percent_change_24h > 0"></i>
          <i class="fa fa-arrow-down" v-if="exchangeInfo.percent_change_24h < 0"></i>
      </h3>
    </div>
    
    <div class="asset-table value">
      <div>
        <h3>Tokens</h3> 
        <h4>{{ c20 }}</h4> 
      </div>
      <div> 
        <h3>NAV Price</h3> 
        <h4>{{ nav }}</h4> 
      </div>
      <div> 
        <h3>Exchange</h3> 
        <h4>{{ exchangeRate }}</h4> 
      </div>
      <div> 
        <h3>Asset Value</h3> 
        <h4>{{ Number(total).toLocaleString('en-US', { style: 'currency', currency: base}) }}</h4> 
      </div>
    </div>
    
    <div v-if="edit">
      <div class="edit-area">
        <div class="element">
          <label>Your C20 Tokens</label>
          <input type="text" v-model="c20">
        </div>
        <div class="element">
          <label>Portfolio Currency</label>
          <select v-model="base" v-if="currencies">
            <option v-for="(item, index) in currencies">{{ index }}</option>
          </select>
        </div>
      </div>
      <div class="button-area">
        <button type="button" @click.prevent="saveToken()">Save Changes </button>
        <button type="button" @click.prevent="getC20()">Refresh Stats </button>
      </div>
    </div>
    
    
    
    <!-- 
    <div class="field-area">
        <div class="area">
            <h2 class="nav">{{ nav }}</h2>
            <h4>Nav Price</h4>
        </div>
        <div class="area">
            <h2 class="portfolio">{{ exchangeRate }}</h2>
            <h4>Exchange Price</h4>
        </div>
    </div>
    <div class="field-area">
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
      
        <div class="area">
            <h2 class="portfolio">{{ Number(exchangeTotal).toLocaleString('en-US', { style: 'currency', currency: base}) }}</h2> 
            <h4>Exchange Value</h4>
        </div>
    </div>
     -->
    
    
    <!-- 
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
      <div
        <button type="button" @click.prevent="saveToken()"><i class="fa fa-floppy-o"></i> </button>
        <button type="button" @click.prevent="getC20()"><i class="fa fa-refresh"></i> </button>
        <select v-model="base" v-if="currencies">
          <option v-for="(item, index) in currencies">{{ index }}</option>
        </select>
      </div>
    </div> -->
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
        exchangeRate: 0,
        exchangeInfo: null,
        base: 'USD',
        edit : false
      }
    },
    mounted(){
      this.getRates();
      this.getC20();
      this.getExchangeRate();
    },
    
    watch: {
      base(){
        localStorage.setItem('c20Base', this.base);
      }
    },
    
    computed:{
      total(){
        return (this.nav * this.c20 * this.currencies[this.base]).toFixed(2);
      },
      exchangeTotal(){
          return (this.exchangeRate * this.c20 * this.currencies[this.base]).toFixed(2);
      }
    },
    
    methods: {
      getRates(){
        axios.get('https://api.fixer.io/latest?base=USD').then((res)=>{
          this.currencies = res.data.rates;
          this.currencies.USD = 1;
        })
      },
      
      getExchangeRate(){
        axios.get('https://api.coinmarketcap.com/v1/ticker/c20/').then((res)=>{
          this.exchangeInfo = res.data[0];
          this.exchangeRate = res.data[0].price_usd;
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
        this.edit = false;
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
  .container{
    background: #38414d;
    color: white;
    padding: 30px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  
  
  .portfolio-total{
    text-align: center;
    margin-bottom: 20px;
  }
  .portfolio-total h2{
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .portfolio-total h3{
    padding: 0;
    margin: 3px 0;
    font-size: 12px;
    font-weight: 400;
  }
  .portfolio-total h3.down{
    background: #ff7200;
    border-radius: 32px;
    display: inline-block;
    padding: 1px 8px;
  }
  .portfolio-total h3.up{
    background: #b3e804;
    border-radius: 32px;
    display: inline-block;
    padding: 1px 8px;
  }
  .portfolio-total p{
    font-size: 12px;
    padding: 0;
    margin: 5px;
    color: #dadada54;
  }
  
  
  
  .asset-table{
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 10px 20px;
    border-radius: 5px;
    margin: 0 20px;
    width: 100%;
  }
  .asset-table h3{
    opacity: 1;
    text-transform: none;
    margin: 2px 0;
    font-size: 11px;
    color: #629bd6;
  }
  
  .asset-table.value h4{
    font-size: 14px;
    opacity: 1;
  }
  
  
  .edit-button{
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .edit-button i{
    font-size: 16px;
    opacity: 0.3;
    cursor: pointer;
    transition: 0.3s all;
  }
  .edit-button i:hover{
    opacity: 1;
  }
  
  .edit-area{
    width: 100%;
    padding: 10px;
    display: flex;
    border-top: 1px dashed #cccccc3b;
    padding-top: 20px;
    margin-top: 10px;
  }
  .edit-area input{
    width: 80%;
    background: transparent;
    border: none;
    font-size: 16px;
    color: white;
    border-bottom: 1px dashed #ffffff1f;
    padding: 2px 0;
    outline: none;
  }
  .edit-area label{
    margin-bottom: 4px;
    display: block;
    opacity: 0.3;
  }
  
  .edit-area .element{
    margin-bottom: 15px;
  }
  .edit-area .element:first-child{
    margin-right: 10px;
  }
  select{
    background: none;
    border: none;
    padding: 0;
    margin: 0 -7px;
    color: white;
    width: 100%;
    font-size: 16px;
  }
  
  
  
  .button-area{
    display: flex;
    width: 100%;
  }
  button{
    background: #5e9bd6;
    border-radius: 3px;
    padding: 10px;
    color: white;
    border: none;
    outline: none;
    width: 100%;
    margin: 0 2px;
    cursor: pointer;
    transition: 0.3s all;
  }
  button:hover{
    background: #55acee;
  }
</style>
