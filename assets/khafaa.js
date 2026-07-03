/* Khafaa Pro engine – modular build
 * full engine inline in index.html (36KB).
 * هذا ملف فصل للـ CDN. */
console.log('Khafaa Pro v4.2 loaded');
// expose version and apply stored theme on load
if(typeof window!=='undefined'){
	window.KHAFAA_VERSION = window.KHAFAA_VERSION || '4.2.stealth';
	try{
		window.addEventListener('load', ()=>{
			const t = localStorage.getItem('khafaa_theme');
			if(t === 'light') document.body.setAttribute('data-theme','light');
		});
	}catch(e){}
}
