(function(){
  'use strict';
  var D=window.VITRINE; if(!D){document.getElementById('grid').textContent='Não foi possível carregar os produtos.';return;}
  var $=function(id){return document.getElementById(id)};
  var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
  var BADGE={'TikTok Shop':'b-tiktok','Amazon':'b-amazon','Mercado Livre':'b-meli'};
  var state={cat:'Todos',q:''};

  $('bio').textContent=D.perfil.bio;
  $('social').innerHTML=D.redes.map(function(r){
    return '<a class="pill '+r.id+'" href="'+r.url+'" target="_blank" rel="noopener noreferrer"><span class="dot" aria-hidden="true"></span>'+r.nome+'</a>';
  }).join('');

  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  function card(p,opt){
    opt=opt||{};
    var price=p.preco?'<p class="price"><small>R$</small>'+esc(p.preco)+'</p>':'<p class="price none">Ver preço na loja</p>';
    var tag=opt.rank?'<span class="rank" aria-label="Posição '+p.ranking+'">'+p.ranking+'</span>':(opt.isNew?'<span class="new">NOVO</span>':'');
    return '<article class="card">'+
      '<a class="thumb" href="'+esc(p.url)+'" target="_blank" rel="sponsored noopener noreferrer" tabindex="-1" aria-hidden="true">'+
        '<img src="'+esc(p.imagem)+'" alt="" width="280" height="280" loading="'+(opt.eager?'eager':'lazy')+'" decoding="async">'+
        '<span class="badge '+(BADGE[p.loja]||'')+'">'+esc(p.loja)+'</span>'+tag+'</a>'+
      '<div class="body"><h3 class="title"><a href="'+esc(p.url)+'" target="_blank" rel="sponsored noopener noreferrer">'+esc(p.nome)+'</a></h3>'+price+
      '<a class="btn" href="'+esc(p.url)+'" target="_blank" rel="sponsored noopener noreferrer" aria-label="Comprar '+esc(p.nome)+' na '+esc(p.loja)+' (abre em nova aba)">Comprar</a></div></article>';
  }

  var P=D.produtos;
  var top=P.filter(function(p){return p.ranking}).sort(function(a,b){return a.ranking-b.ranking});
  var news=P.filter(function(p){return p.novidade});
  if(top.length){$('top').hidden=false;$('rail-top').innerHTML=top.map(function(p){return '<li>'+card(p,{rank:true,eager:true})+'</li>'}).join('')}
  if(news.length){$('news').hidden=false;$('rail-news').innerHTML=news.map(function(p){return '<li>'+card(p,{isNew:true})+'</li>'}).join('')}

  var cats=['Todos'].concat(Array.from(new Set(P.map(function(p){return p.categoria}))));
  $('chips').innerHTML=cats.map(function(c){
    var n=c==='Todos'?P.length:P.filter(function(p){return p.categoria===c}).length;
    return '<button type="button" class="chip" data-c="'+esc(c)+'" aria-pressed="'+(c==='Todos')+'">'+esc(c)+' <span aria-hidden="true">· '+n+'</span></button>';
  }).join('');

  function render(){
    var q=norm(state.q).trim();
    var list=P.filter(function(p){
      return (state.cat==='Todos'||p.categoria===state.cat)&&(!q||norm(p.nome+' '+p.loja+' '+p.categoria).indexOf(q)>-1);
    });
    $('grid').innerHTML=list.map(function(p){return '<li>'+card(p)+'</li>'}).join('');
    $('empty').hidden=list.length>0;
    $('count').textContent=list.length+(list.length===1?' oferta':' ofertas');
    var filtering=state.cat!=='Todos'||q;
    if(top.length)$('top').hidden=!!filtering;
    if(news.length)$('news').hidden=!!filtering;
    $('h-all').textContent=filtering?'Resultados':'Todas as ofertas';
  }
  $('chips').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b)return;
    state.cat=b.dataset.c;
    Array.prototype.forEach.call($('chips').children,function(x){x.setAttribute('aria-pressed',x===b)});
    render();
  });
  var t;$('q').addEventListener('input',function(e){clearTimeout(t);var v=e.target.value;t=setTimeout(function(){state.q=v;render()},120)});
  $('reset').addEventListener('click',function(){
    state={cat:'Todos',q:''};$('q').value='';
    Array.prototype.forEach.call($('chips').children,function(x,i){x.setAttribute('aria-pressed',i===0)});
    render();$('q').focus();
  });
  render();
})();
