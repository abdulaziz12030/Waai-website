// تفعيل أزرار "اطلب الخدمة" واختيار الخدمة تلقائيًا
    document.querySelectorAll('.ask-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const serviceText = btn.dataset.service || 'طلب استشارة';
        const form = document.getElementById('leadForm');
        if(form){
          // اذهب فورًا للنموذج (بدون تمرير ناعم)
          form.scrollIntoView();
          const select = document.getElementById('serviceSelect');
          if(select){
            Array.from(select.options).forEach(o=>{
              o.selected = (o.text.trim() === serviceText.trim());
            });
          }
          const nameInput = form.querySelector('input[name="name"]');
          if(nameInput) nameInput.focus();
        }
      });
    });

    // Scroll reveal + counters
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('show');
          if(e.target.querySelector && e.target.querySelector('.counter')) startCounters(e.target);
          io.unobserve(e.target);
        }
      })
    },{threshold:.2});
    document.querySelectorAll('.reveal, .stat, .card').forEach(el=>io.observe(el));

    function startCounters(scope){
      scope.querySelectorAll('.counter').forEach(el=>{
        const target = +el.dataset.target; const dur = 1400 + Math.random()*800;
        const start = performance.now();
        function tick(t){
          const p = Math.min(1,(t-start)/dur);
          el.textContent = Math.floor(target*p).toLocaleString('en-US');
          if(p<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }

    // Back to top
    const toTop = document.getElementById('toTop');
    window.addEventListener('scroll', ()=>{ toTop.style.display = (window.scrollY > 400) ? 'block' : 'none'; });
    toTop.addEventListener('click', ()=> window.scrollTo({top:0}));

    // Thank You overlay helpers
    const thanksEl = document.getElementById('thanks');
    function showThanks(){ thanksEl.style.display='flex'; thanksEl.setAttribute('aria-hidden','false'); }
    function hideThanks(){ thanksEl.style.display='none'; thanksEl.setAttribute('aria-hidden','true'); }

    // Submit form (Formspree)
    async function submitLead(ev){
      ev.preventDefault();
      const form = ev.target;
      const endpoint = form.dataset.endpoint;
      const btn = document.getElementById('submitBtn') || form.querySelector('button[type="submit"]');
      const ok = document.getElementById('okMsg');
      const no = document.getElementById('noMsg');
      ok.style.display='none'; no.style.display='none';
      if(btn){ btn.disabled = true; btn.textContent = '... جارٍ الإرسال'; }
      const data = Object.fromEntries(new FormData(form).entries());
      try{
        const res = await fetch(endpoint, {
          method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
          body: JSON.stringify(data)
        });
        if(res.ok){
          form.reset(); ok.style.display='block'; showThanks();
          setTimeout(()=>{ hideThanks(); }, 7000);
        }else{
          no.style.display='block';
        }
      }catch(_){ no.style.display='block'; }
      finally{ if(btn){ btn.disabled=false; btn.textContent='إرسال الطلب'; } }
      return false;
    }
