/* Champion Plumbing — shared behaviour */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- sticky header ---- */
  var hdr = document.getElementById('hdr');
  if(hdr){
    window.addEventListener('scroll', function(){
      hdr.classList.toggle('shrunk', window.scrollY > 40);
    }, {passive:true});
  }

  /* ---- mobile nav ---- */
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if(burger && nav){
    burger.addEventListener('click', function(){
      var open = nav.style.display === 'flex';
      nav.style.display = open ? '' : 'flex';
      if(!open){
        Object.assign(nav.style,{position:'absolute',top:'100%',left:'0',right:'0',flexDirection:'column',
          gap:'0',background:'#fff',padding:'12px 28px 22px',borderBottom:'1px solid #ECE6D9',
          boxShadow:'0 12px 30px rgba(10,18,51,.08)'});
      }
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ if(innerWidth <= 1000) nav.style.display=''; });
    });
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el,i){
    el.style.transitionDelay = ((i % 3) * 90) + 'ms';
    io.observe(el);
  });

  /* ---- hero marker swipes fire on load ---- */
  setTimeout(function(){
    document.querySelectorAll('.hero .mark, .phero .mark').forEach(function(m){ m.classList.add('on'); });
  }, 700);

  /* ---- count-up numbers ---- */
  document.querySelectorAll('.cnt').forEach(function(el){
    new IntersectionObserver(function(es, ob){
      if(!es[0].isIntersecting) return;
      ob.disconnect();
      var to = +el.dataset.to, suf = el.dataset.suf || '', st = performance.now();
      (function step(now){
        var p = Math.min((now - st) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e).toLocaleString() + suf;
        if(p < 1) requestAnimationFrame(step);
      })(st);
    }, {threshold:.5}).observe(el);
  });

  /* ---- PSI readout + jet bars ---- */
  var bars = document.getElementById('bars');
  if(bars){
    for(var i = 0; i < 12; i++){
      bars.insertAdjacentHTML('beforeend', '<i style="animation-delay:' + (i * 0.11) + 's"></i>');
    }
  }
  var psi = document.getElementById('psi');
  if(psi && !reduce){
    new IntersectionObserver(function(es, ob){
      if(!es[0].isIntersecting) return; ob.disconnect();
      var v = 0, t = setInterval(function(){
        v += 137; if(v >= 4000){ v = 4000; clearInterval(t); }
        psi.innerHTML = v.toLocaleString() + ' <small>PSI</small>';
      }, 26);
    }, {threshold:.5}).observe(psi);
  }

  /* ---- headline word reveal + gold swoosh ---- */
  var hl = document.getElementById('hl');
  if(hl){
    var accWords = (hl.dataset.accent || '').split('|').filter(Boolean);
    hl.innerHTML = hl.textContent.trim().split(' ').map(function(w, i){
      var d = 'animation-delay:' + (0.18 + i * 0.09) + 's';
      var isAcc = accWords.some(function(a){ return w.indexOf(a) > -1; });
      return '<span class="w' + (isAcc ? ' acc' : '') + '" style="' + d + '">' + w + '</span>';
    }).join(' ');
    var acc = hl.querySelectorAll('.acc');
    if(acc.length){
      var sw = document.createElement('span');
      sw.className = 'swoosh';
      acc[0].parentNode.insertBefore(sw, acc[0]);
      for(var a = 0; a < acc.length; a++){
        if(a) sw.appendChild(document.createTextNode(' '));
        sw.appendChild(acc[a]);
      }
      sw.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 400 90" preserveAspectRatio="none"><path d="M12 52C60 18 180 8 300 20c70 7 96 26 84 40-14 16-120 26-250 18C48 72 6 58 20 40"/></svg>');
    }
  }

  /* ---- magnetic buttons + card tilt ---- */
  if(!reduce){
    document.querySelectorAll('.mag').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2) * .22) + 'px,'
                                          + ((e.clientY - r.top - r.height/2) * .3) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  /* ---- forms ---- */
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var light = f.classList.contains('form-light');
      f.innerHTML = '<p style="font-family:Sora;font-weight:800;font-size:25px;margin:0 0 10px;color:'
        + (light ? '#0A1233' : '#fff') + '">Request sent.</p>'
        + '<p style="color:#8B98BE;font-size:15px;margin:0">We will call you back shortly. '
        + 'For an emergency, call 239-257-2249 now.</p>';
    });
  });
})();
