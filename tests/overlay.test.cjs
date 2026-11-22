// Behaviour tests for the shipped runtime. No browser automation or dependencies.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
require('node:events').setMaxListeners(0);
const source = fs.readFileSync('extension/media/js/overlay.js', 'utf8');

function runtime({ time = '2026-12-24T10:00:00Z', config = {enabled:true, effect:'auto'},
  hostname = '127.0.0.1', query = '?festive-overlay-test=1&festive-overlay-time=2026-12-24T10:00:00Z&festive-overlay-speed=0',
  reduced = false, saved = {}, unavailableStorage = false, walksHeading = false, demo = false,
  background = 'rgb(255, 255, 255)' } = {}) {
  let now = Date.parse(time), options = config, next = 0;
  const frames = new Map(), intervals = new Map(), images = [], warnings = [];
  const storage = new Map(Object.entries(saved));
  const observers = new Set();
  class Element extends EventTarget {
    constructor(tag) { super(); this.tagName=tag; this.children=[]; this.attributes={}; this.dataset={}; this.hidden=false; this.value=''; this.style={}; }
    get isConnected() { return this === document.body || Boolean(this.parentNode?.isConnected); }
    append(...nodes) { nodes.forEach(node => { node.remove(); this.children.push(node); node.parentNode=this; }); }
    prepend(node) { node.remove(); this.children.unshift(node); node.parentNode=this; }
    before(node) { node.remove(); this.parentNode.children.splice(this.parentNode.children.indexOf(this),0,node); node.parentNode=this.parentNode; }
    remove() { if(this.parentNode) { this.parentNode.children=this.parentNode.children.filter(x=>x!==this); this.parentNode=null; } }
    setAttribute(key,value) { this.attributes[key]=String(value); }
    getAttribute(key) { return this.attributes[key] ?? null; }
    click() { this.dispatchEvent(new Event('click')); }
    getContext() {
      return new Proxy({measureText: text=>({width:text.length*7}), getImageData:()=>({data:new Uint8Array(360*180*4)})},
        {get:(target,key)=>target[key] ?? (()=>{})});
    }
  }
  const document = new EventTarget();
  document.body=new Element('body'); document.documentElement=new Element('html'); document.hidden=false;
  document.readyState='complete'; document.createElement=tag=>new Element(tag);
  document.currentScript={src:'http://'+hostname+'/media/plg_system_festiveoverlay/js/overlay.js'};
  const headings=[];
  if(walksHeading) {
    const section=new Element('section'), heading=new Element('h3');
    heading.textContent='Our Next Walks'; section.append(heading); document.body.append(section); headings.push(heading);
  }
  document.querySelectorAll=()=>headings;
  document.getElementById=id=>id==='festive-overlay-demo'&&demo ? document.body : null;
  const motion=new EventTarget(); motion.matches=reduced;
  const window=new EventTarget();
  Object.assign(window, {innerWidth:1000, innerHeight:800, Joomla:{getOptions:()=>options}});
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const context = vm.createContext({window, document, Date:Clock, Intl, URL, URLSearchParams, AbortController,
    location:{hostname, search:query, href:'http://'+hostname+'/'}, innerWidth:1000, innerHeight:800, devicePixelRatio:1,
    matchMedia:()=>motion, getComputedStyle:()=>({backgroundColor:background}),
    MutationObserver:class {constructor(callback){this.callback=callback;observers.add(this);} observe(){} disconnect(){observers.delete(this);}}, performance:{now:()=>0},
    Image:class {set src(value){images.push(value);} complete=false;},
    localStorage:{getItem:key=>{if(unavailableStorage)throw Error('blocked');return storage.get(key)??null;},
      setItem:(key,value)=>{if(unavailableStorage)throw Error('blocked');storage.set(key,value);}},
    requestAnimationFrame:fn=>{frames.set(++next,fn);return next;}, cancelAnimationFrame:id=>frames.delete(id),
    setInterval:fn=>{intervals.set(++next,fn);return next;}, clearInterval:id=>intervals.delete(id),
    console:{warn:(...args)=>warnings.push(args.join(' '))}});
  const load=()=>vm.runInContext(source,context);
  const elements=()=>{const result=[];const walk=x=>{result.push(x);x.children.forEach(walk);};walk(document.body);return result;};
  const canvas=()=>elements().find(x=>x.className==='festive-overlay-canvas');
  const controls=()=>elements().find(x=>x.className==='festive-overlay-controls');
  const button=label=>elements().find(x=>x.tagName==='button'&&(x.textContent===label||x.getAttribute('aria-label')===label));
  load();
  return {window,document,images,warnings,frames,storage,motion,load,elements,canvas,controls,button,
    snapshot:()=>JSON.parse(canvas().dataset.snapshot),
    config:value=>{options=value;window.FestiveOverlay.refresh();},
    background:value=>{background=value;[...observers].forEach(o=>o.callback());},
    animate:count=>{for(let i=0;i<count;i++){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn((i+1)*50));}},
    clock:value=>{now=Date.parse(value);[...intervals.values()].forEach(fn=>fn());},
    event:(target,type)=>target.dispatchEvent(new Event(type))};
}

test('production needs explicit enablement and ignores preview query parameters',()=>{
  for(const config of [null,{}, {enabled:false}]) {
    const r=runtime({config,hostname:'www.altonramblers.org.uk'});
    assert.equal(r.canvas(),undefined);
  }
  const r=runtime({hostname:'www.altonramblers.org.uk',time:'2026-11-21T12:00:00Z'});
  assert.equal(r.canvas().hidden,true); assert.equal(r.frames.size,0);
});

test('public snow presets work outside the season and select the sleigh explicitly',()=>{
  for(const santa of [false,true]) {
    const r=runtime({hostname:'example.org',time:'2026-07-01T12:00:00Z',
      query:santa?'?festive-santa=true':'?festive-snow=true',
      config:{enabled:true,effect:'fireworks',sleigh:!santa}});
    assert.equal(r.canvas().hidden,false);
    assert.equal(Boolean(r.snapshot().destination),santa);
    assert.equal(r.images.length,santa?1:0);
    assert.equal(r.button('Step'),undefined);
    assert.equal(r.frames.size,1);
  }
});

test('public New Year presets choose fireworks only, drones only or both',()=>{
  for(const mode of ['fireworks','drone','fireworks-drone']) {
    const r=runtime({hostname:'example.org',time:'2026-07-01T12:00:00Z',
      query:'?festive-'+mode+'=true',config:{enabled:true,effect:'snow',drone:mode==='fireworks'}});
    assert.equal(r.canvas().hidden,false);
    r.animate(1);
    assert.equal(r.snapshot().show,mode==='drone'?'drones':'fireworks');
    assert.equal(r.snapshot().rockets>0,mode!=='drone');
    assert.equal(r.snapshot().sound,false);
    // Start a fresh runtime so animation timestamps increase across the entire show.
    const complete=runtime({hostname:'example.org',time:'2026-07-01T12:00:00Z',query:'?festive-'+mode+'=true'});
    complete.animate(2700);
    assert.equal(complete.snapshot().show,mode==='fireworks'?'fireworks':'drones');
    if(mode==='drone') assert.equal(complete.snapshot().rockets+complete.snapshot().sparks,0);
    assert.deepEqual(complete.warnings,[]);
  }
});

test('public presets require Joomla enablement or the standalone documentation marker',()=>{
  const options={hostname:'example.org',query:'?festive-snow=true'};
  assert.equal(runtime({...options,config:null}).canvas(),undefined);
  assert.equal(runtime({...options,config:{enabled:false}}).canvas(),undefined);
  const demo=runtime({...options,config:null,demo:true,reduced:true});
  assert.equal(demo.snapshot().paused,true);
  assert.equal(demo.frames.size,0);
  assert.equal(runtime({...options,config:null,demo:true,query:''}).canvas(),undefined);
  const ordinary=runtime({...options,time:'2026-07-01T12:00:00Z',query:'?festive-snow=false'});
  assert.equal(ordinary.canvas().hidden,true);
});

test('the default snow season includes 30 December and ends before 31 December',()=>{
  const r=runtime({hostname:'example.org',time:'2026-11-30T23:59:59Z',query:'',
    config:{enabled:true,effect:'snow'}});
  assert.equal(r.canvas().hidden,true);
  r.clock('2026-12-01T00:00:00Z'); assert.equal(r.canvas().hidden,false);
  r.clock('2026-12-30T23:59:59Z'); assert.equal(r.canvas().hidden,false);
  r.clock('2026-12-31T00:00:00Z'); assert.equal(r.canvas().hidden,true); assert.equal(r.frames.size,0);
});

test('a configured snow season can still extend into January',()=>{
  const r=runtime({hostname:'www.altonramblers.org.uk',time:'2026-11-30T23:59:59Z',query:'',
    config:{enabled:true,effect:'snow',season_end:'01-06'}});
  assert.equal(r.canvas().hidden,true);
  r.clock('2026-12-01T00:00:00Z'); assert.equal(r.canvas().hidden,false);
  r.clock('2027-01-06T23:59:59Z'); assert.equal(r.canvas().hidden,false);
  r.clock('2027-01-07T00:00:00Z'); assert.equal(r.canvas().hidden,true); assert.equal(r.frames.size,0);
});

test('automatic mode switches to fireworks on 1 January with the default snow season',()=>{
  const r=runtime({hostname:'example.org',time:new Date(2026,11,31,12).toISOString(),query:''});
  assert.equal(r.canvas().hidden,true);
  r.clock(new Date(2027,0,1,0).toISOString());
  assert.equal(r.canvas().hidden,false);
  assert.ok(r.button('Pause fireworks'));
});

test('the sleigh follows the 25-hour flight window and keeps fractional-zone handovers',()=>{
  for(const [time,expected] of [['2026-12-24T09:59:59Z',undefined],['2026-12-24T10:00:00Z','Kiritimati'],
    ['2026-12-24T18:15:00Z','Nepal'],['2026-12-25T10:59:59Z','Hawaii'],['2026-12-25T11:00:00Z',undefined]]) {
    const r=runtime({query:'?festive-overlay-test=1&festive-overlay-time='+time});
    assert.equal(r.snapshot().destination,expected);
    if(expected) assert.match(r.images[0],/\/media\/plg_system_festiveoverlay\/images\/sleigh.png$/);
  }
});

test('the live sleigh stops at the cutoff while snow continues',()=>{
  const r=runtime({hostname:'example.org',query:'',time:'2026-12-25T10:59:59Z'});
  assert.equal(r.images.length,1);
  r.clock('2026-12-25T11:00:00Z');
  assert.equal(r.canvas().hidden,false);
  assert.equal(r.frames.size,1);
  const after=runtime({hostname:'example.org',query:'',time:'2026-12-25T11:00:00Z'});
  assert.equal(after.images.length,0);
});

test('the current Santa zone preview stays in the flight window at any UTC hour',()=>{
  for(const [time,expected] of [['2026-07-01T18:15:00Z','Nepal'],['2026-07-01T10:05:00Z','Kiritimati'],
    ['2026-12-25T10:30:00Z','Hawaii']]) {
    const r=runtime({time});
    const presets=r.elements().find(el=>el.getAttribute('aria-label')==='Preview preset');
    presets.value='Current Santa zone';
    r.event(presets,'change');
    assert.equal(r.snapshot().destination,expected);
    r.animate(1);
    assert.equal(r.snapshot().destination,expected);
  }
});

test('pause and hide preferences persist and survive switching effects',()=>{
  const r=runtime(); r.button('Pause snow').click(); r.button('Turn festive mode off').click();
  assert.equal(r.snapshot().paused,true); assert.equal(r.snapshot().hidden,true); assert.equal(r.frames.size,0);
  r.config({enabled:true,effect:'fireworks'});
  assert.equal(r.snapshot().paused,true); assert.equal(r.snapshot().hidden,true);
  assert.equal(r.snapshot().sound,false);
  assert.deepEqual(JSON.parse(r.storage.get('festive-overlay:preferences')),{paused:true,hidden:true});
});

test('reduced motion, printing and hidden tabs stop animation; controls remain usable',()=>{
  const r=runtime({reduced:true});
  assert.equal(r.snapshot().paused,true);assert.equal(r.frames.size,0);
  r.button('Resume snow').click();assert.equal(r.frames.size,1);
  r.document.hidden=true;r.event(r.document,'visibilitychange');assert.equal(r.frames.size,0);
  r.document.hidden=false;r.event(r.document,'visibilitychange');assert.equal(r.frames.size,1);
  r.event(r.window,'beforeprint');assert.equal(r.frames.size,0);
  r.event(r.window,'afterprint');assert.equal(r.frames.size,1);
  r.event(r.motion,'change');assert.equal(r.snapshot().paused,true);
});

test('duplicate loading and configuration changes never duplicate the overlay',()=>{
  const r=runtime();r.load();r.window.FestiveOverlay.refresh();
  assert.equal(r.elements().filter(x=>x.className==='festive-overlay-canvas').length,1);
  r.config({enabled:true,effect:'snow',palette:'dark',position:'bottom-left'});
  assert.equal(r.snapshot().colour,'#fff');assert.equal(r.controls().dataset.position,'bottom-left');
  r.config(null); // Preview can run without options, but explicit disposal removes everything.
  r.window.FestiveOverlay.dispose();assert.equal(r.canvas(),undefined);assert.equal(r.frames.size,0);
});

test('blocked storage does not prevent animation or controls',()=>{
  const r=runtime({unavailableStorage:true});r.button('Turn festive mode off').click();assert.equal(r.snapshot().hidden,true);
  assert.deepEqual(r.warnings,[]);
});

test('New Year local-time window covers all of 1 January in Nepal',()=>{
  for(const [time,active] of [['2026-12-31T18:14:59Z',false],['2026-12-31T18:15:00Z',true],
    ['2026-12-31T20:14:59Z',true],['2026-12-31T20:15:00Z',true],['2027-01-01T06:15:00Z',true],
    ['2027-01-01T18:14:59Z',true],['2027-01-01T18:15:00Z',false]]) {
    const r=runtime({config:{enabled:true,effect:'fireworks'},
      query:'?festive-overlay-test=1&festive-overlay-zone=Asia%2FKathmandu&festive-overlay-time='+time});
    assert.equal(r.snapshot().active,active);assert.equal(r.frames.size,active?1:0);
  }
});

test('a two-hour New Year display ends at 02:00 in a fractional time zone',()=>{
  for(const [time,active] of [['2026-12-31T18:14:59Z',false],['2026-12-31T18:15:00Z',true],
    ['2026-12-31T20:14:59Z',true],['2026-12-31T20:15:00Z',false]]) {
    const r=runtime({config:{enabled:true,effect:'fireworks',fireworks_hours:2},
      query:'?festive-overlay-test=1&festive-overlay-zone=Asia%2FKathmandu&festive-overlay-time='+time});
    assert.equal(r.snapshot().active,active);
    assert.equal(r.frames.size,active?1:0);
  }
});

test('an open page in Automatic mode stops the display at the configured hour',()=>{
  const r=runtime({hostname:'example.org',query:'',time:new Date(2027,0,1,1,59,59).toISOString(),
    config:{enabled:true,effect:'auto',fireworks_hours:2}});
  assert.equal(r.canvas().hidden,false);
  r.clock(new Date(2027,0,1,2).toISOString());
  assert.equal(r.canvas().hidden,true);
  assert.equal(r.frames.size,0);
});

test('a custom fireworks start date and duration use the same local clock in both modes',()=>{
  for(const effect of ['auto','fireworks']) {
    for(const [time,active] of [
      ['2026-12-30T18:14:59Z',false], ['2026-12-30T18:15:00Z',true],
      ['2026-12-30T20:14:59Z',true], ['2026-12-30T20:15:00Z',false],
      ['2026-12-31T18:15:00Z',false],
    ]) {
      const r=runtime({config:{enabled:true,effect,fireworks_start:'12-31',fireworks_hours:2},
        query:'?festive-overlay-test=1&festive-overlay-zone=Asia%2FKathmandu&festive-overlay-time='+time});
      assert.equal(r.snapshot().active ?? false,active);
      assert.deepEqual(r.warnings,[]);
    }
  }
});

test('automatic mode uses the preview clock and keeps Joomla-independent controls',()=>{
  const r=runtime({query:'?festive-overlay-test=1&festive-overlay-time=2027-01-01T00:30:00Z'});
  assert.equal(r.snapshot().effect,'fireworks');assert.equal(r.snapshot().sound,false);
  assert.ok(r.button('Enable fireworks sound').isConnected);
  r.button('Pause fireworks').click();assert.equal(r.button('Resume fireworks').getAttribute('aria-label'),'Resume fireworks');
  r.config({enabled:true,effect:'fireworks',sound:false});assert.equal(r.button('Enable fireworks sound').hidden,true);
});

test('snow accumulation stays bounded during ten simulated minutes',()=>{
  const r=runtime({config:{enabled:true,effect:'snow',sleigh:false},reduced:true});
  for(let i=0;i<36000;i++)r.button('Step').click();
  assert.ok(r.snapshot().bank<=48);assert.ok(r.snapshot().particles<=180);assert.deepEqual(r.warnings,[]);
});

test('controls sit immediately above Our Next Walks and fall back on other pages',()=>{
  const r=runtime({walksHeading:true,query:'?festive-overlay-test=1&festive-overlay-panel=0'});
  assert.equal(r.controls().dataset.position,'above-walks');
  assert.equal(r.controls().parentNode.children[1].textContent,'Our Next Walks');
  assert.equal(r.controls().children.length,2);
  r.button('Turn festive mode off').click();assert.equal(r.snapshot().hidden,true);
  assert.ok(r.button('Turn festive mode on').isConnected);
  r.button('Turn festive mode on').click();assert.equal(r.snapshot().hidden,false);
  r.config({enabled:true,effect:'fireworks',position:'above-walks'});
  assert.equal(r.controls().parentNode.children[1].textContent,'Our Next Walks');
  assert.equal(r.elements().filter(x=>x.className==='festive-overlay-controls').length,1);
  r.window.FestiveOverlay.dispose();
  assert.equal(r.document.body.children[0].children.length,1);
  const fallback=runtime();assert.equal(fallback.controls().parentNode,fallback.document.body);
  assert.equal(fallback.controls().dataset.position,'bottom-right');
});

test('New Year fireworks hand over to drones and can keep drones disabled',()=>{
  for(const enabled of [true,false]) {
    const r=runtime({config:{enabled:true,effect:'fireworks',drone:enabled},reduced:true,
      query:'?festive-overlay-test=1&festive-overlay-time=2027-01-01T00:30:00Z&festive-overlay-speed=0'});
    const step=r.button('Advance fireworks one frame');
    for(let i=0;i<8100;i++)step.click();
    assert.equal(r.snapshot().show,enabled?'drones':'fireworks');
    assert.equal(r.snapshot().sound,false);assert.deepEqual(r.warnings,[]);
  }
});

test('paused effects update their palette immediately when a template switches theme',()=>{
  for(const effect of ['snow','fireworks']) {
    const r=runtime({config:{enabled:true,effect},reduced:true,background:'rgb(22, 29, 26)',
      query:'?festive-overlay-test=1&festive-overlay-panel=0&festive-overlay-time=2027-01-01T00:30:00Z'});
    assert.equal(r.controls().dataset.theme,'dark');
    if(effect==='snow')assert.equal(r.snapshot().colour,'#fff');
    r.background('rgb(255, 255, 255)');
    assert.equal(r.controls().dataset.theme,'light');
    if(effect==='snow')assert.equal(r.snapshot().colour,'#111');
    assert.equal(r.snapshot().paused,true);
    r.window.FestiveOverlay.dispose();
  }
});

test('Christmas preview keeps flying when its diagnostic panel is hidden',()=>{
  const r=runtime({query:'?festive-overlay-test=1&festive-overlay-panel=0&festive-overlay-time=2026-12-24T10:00:00Z&festive-overlay-speed=0'});
  const first=r.snapshot().destination;
  assert.doesNotThrow(()=>r.animate(1200));
  assert.equal(r.frames.size,1);
  assert.notEqual(r.snapshot().destination,first);
});
