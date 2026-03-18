import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Dashboard = {
  init(){
    this.render();
  },
  render(){
    const data = Storage.read();
    const products = data.products || [];
    const sales = data.sales || {};
    // total products
    document.getElementById('totalProducts') && (document.getElementById('totalProducts').textContent = products.length);
    // stock value
    const stockValue = products.reduce((s,p)=> s + (p.buy * p.quantity),0);
    document.getElementById('stockValue') && (document.getElementById('stockValue').textContent = '₹'+stockValue);
    // today keys
    const today = new Date().toISOString().slice(0,10);
    const todaySales = sales[today] || [];
    const salesAmount = todaySales.reduce((s,entry)=> s + (entry.amount || 0),0);
    const profit = todaySales.reduce((s,entry)=> s + (entry.profit || 0),0);
    document.getElementById('salesToday') && (document.getElementById('salesToday').textContent = '₹'+salesAmount);
    document.getElementById('profitToday') && (document.getElementById('profitToday').textContent = '₹'+profit);
    // low stock
    const low = products.filter(p=>p.quantity<5);
    const list = document.getElementById('lowStockList');
    if(list){ list.innerHTML = low.length ? low.map(p=>`<li>${p.name} (${p.quantity})</li>`).join('') : '<li>No low stock</li>'; }
    // insights
    const ins = document.getElementById('insights');
    if(ins){
      let msg = '';
      if(low.length) msg += `Stock running low for ${low.map(p=>p.name).slice(0,3).join(', ')}.`;
      if(profit>1000) msg += ` Great job — high profit today!`;
      if(!todaySales.length) msg += ' No sales today — try a small discount.';
      ins.textContent = msg || 'All good — keep selling!';
    }
    // trend chart simple
    const canvas = document.getElementById('trendChart');
    if(canvas) this.drawTrend(canvas, sales);
  },
  drawTrend(canvas, sales){
    const ctx = canvas.getContext('2d');
    const labels = [];
    const data = [];
    for(let i=6;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = d.toISOString().slice(0,10);
      labels.push(key.slice(5));
      const s = (sales[key] || []).reduce((a,b)=>a+(b.amount||0),0);
      data.push(s);
    }
    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // draw axis and bars
    const w = canvas.width, h = canvas.height; const max = Math.max(...data,1);
    const barW = w / (data.length*1.6);
    data.forEach((val,i)=>{
      const x = 10 + i*(barW*1.6);
      const barH = (val/max)*(h-30);
      ctx.fillStyle = 'rgba(255,87,34,0.9)';
      ctx.fillRect(x, h-20-barH, barW, barH);
      ctx.fillStyle='#fff'; ctx.font='10px sans-serif'; ctx.fillText(labels[i], x, h-5);
    });
  }
};