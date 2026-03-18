export const Storage = {
  key: 'shopease_v1',
  init(){ if(!localStorage.getItem(this.key)){ const seed={products:[], sales:{}, customers:[], expenses:[], theme:'dark'}; localStorage.setItem(this.key, JSON.stringify(seed)); } },
  read(){ return JSON.parse(localStorage.getItem(this.key) || '{}'); },
  write(data){ localStorage.setItem(this.key, JSON.stringify(data)); },
  reset(){ localStorage.removeItem(this.key); this.init(); }
};