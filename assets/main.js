
(() => {
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>[...root.querySelectorAll(s)];
 if(window.lucide) lucide.createIcons();

 // Reveal elements as they enter view.
 const revealItems=$$(".reveal");
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
   });
  },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  revealItems.forEach(el=>observer.observe(el));
 } else revealItems.forEach(el=>el.classList.add("visible"));

 // Mobile navigation.
 const toggle=$(".menu-toggle"), panel=$(".mobile-panel");
 if(toggle&&panel){
  toggle.addEventListener("click",()=>{
   const open=panel.classList.toggle("open");
   toggle.setAttribute("aria-expanded",String(open));
   toggle.innerHTML=open?'<i data-lucide="x"></i>':'<i data-lucide="menu"></i>';
   if(window.lucide)lucide.createIcons();
  });
  $$(".mobile-panel a").forEach(a=>a.addEventListener("click",()=>panel.classList.remove("open")));
 }

 // Branded transition before internal page changes.
 const wipe=$(".page-wipe");
 document.addEventListener("click",e=>{
  const a=e.target.closest("a");
  if(!a||!wipe)return;
  const href=a.getAttribute("href");
  if(!href||href.startsWith("#")||href.startsWith("mailto:")||href.startsWith("tel:")||a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname)return;
  e.preventDefault();
  if(document.body.classList.contains("leaving"))return;
  document.body.classList.add("leaving");wipe.classList.add("active");
  setTimeout(()=>location.href=url.href,620);
 });

 // Appointment enquiry: Getform endpoint is a replaceable placeholder.
 const form=$("#bookingForm");
 if(form){
  form.addEventListener("submit",async e=>{
   e.preventDefault();
   const status=$(".form-status",form),btn=$(".submit-button",form);
   const endpoint="https://getform.io/f/REPLACE_WITH_YOUR_FORM_ID";
   if(endpoint.includes("REPLACE_WITH_YOUR_FORM_ID")){
    status.textContent="Your form is ready. Add your Getform endpoint in assets/main.js to receive enquiries.";
    return;
   }
   btn.disabled=true;btn.style.opacity=".65";status.textContent="Sending your request…";
   try{
    const response=await fetch(endpoint,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error("Request failed");
    status.textContent="Thank you. Your appointment enquiry has been sent.";
    form.reset();
   }catch(err){status.textContent="We couldn't send that just now. Please call the workshop instead.";}
   finally{btn.disabled=false;btn.style.opacity="1";}
  });
 }
})();
