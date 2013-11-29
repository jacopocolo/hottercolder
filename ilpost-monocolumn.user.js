// ==UserScript==
// @name       	 ilPost, monocolumn
// @namespace  	 
// @version		 0.1
// @author       Jacopo Colò
// @description  Questo script cancella la colonna laterale de ilpost.it, portandolo su una singola colonna. Le modifiche sono basate sul modello The 100% Easy-2-Read Standard (http://ia.net/blog/100e2r/) di Information Architects. 
// @match          http://www.ilpost.it/2*
// ==/UserScript==

/*
TOFIX:
- Nella pagina delle gallery lo stile non dovrebbe applicarsi
- Il titolo e occhiello sono troppo piccoli rispetto al corpo del testo
*/

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.entry-content {max-width: 650px !important; font-size: 1.3em; line-height: 1.55em; !important;}');
addGlobalStyle('#sidebar {float: left !important;}');
addGlobalStyle('.widget.adv {position: absolute !important; top: 849px !important; right: 150px !important;}');
addGlobalStyle('#content {border-right: none !important; padding: 0 !important;}');
addGlobalStyle('.widget.tt {display: none;}');
addGlobalStyle('.widget.ultime {display: none;}');
addGlobalStyle('.widget.fbb {display: none;}');
addGlobalStyle('.widget.photoday {display: none;}');
addGlobalStyle('.widget.commentate {display: none;}');
addGlobalStyle('.widget.photoarc {display: none;}');
addGlobalStyle('.widget.blogger_news {display: none;}');
addGlobalStyle('div.entry-meta {display: none;}');