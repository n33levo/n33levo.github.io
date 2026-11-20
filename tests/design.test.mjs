import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import FakeTimers from '@sinonjs/fake-timers';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { default: Terminal } = await vite.ssrLoadModule('/src/components/TerminalWindow.tsx');
const { default: Chat } = await vite.ssrLoadModule('/src/components/ChatWindow.tsx');
const { default: Index } = await vite.ssrLoadModule('/src/pages/Index.tsx');
const { default: RepPage } = await vite.ssrLoadModule('/src/pages/Chai.tsx');
const { default: ChaiPage } = await vite.ssrLoadModule('/src/pages/ChaiClassic.tsx');
const { MemoryRouter } = await import('react-router-dom');
await vite.close();

function text(renderer) { return JSON.stringify(renderer.toJSON()); }
function advance(clock, milliseconds) {
  for (let elapsed = 0; elapsed < milliseconds; elapsed += 100) act(() => { clock.tick(100); });
}
function setupGlobals() {
  const values = new Map();
  globalThis.sessionStorage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) };
  globalThis.document = { querySelector: () => null };
}

test('All original animation CSS and terminal animation helpers match the pre-update design', () => {
  for (const path of ['src/index.css','src/App.css']) {
    assert.equal(readFileSync(path, 'utf8'), execFileSync('git',['show',`de2070e:${path}`],{encoding:'utf8'}));
  }
  const current = readFileSync('src/components/TerminalWindow.tsx','utf8');
  const original = execFileSync('git',['show','de2070e:src/components/TerminalWindow.tsx'],{encoding:'utf8'});
  const section = source => source.slice(source.indexOf('// TypewriterEffect component'),source.indexOf('interface TerminalWindowProps'));
  assert.equal(section(current).replace(/[ \t]+$/gm, ""),section(original).replace(/[ \t]+$/gm, ""));
});

test('Terminal about reveals in stages and latest projects retain animated skill chips', () => {
  const clock = FakeTimers.install({toFake:['setTimeout','clearTimeout','setInterval','clearInterval','Date']});
  let renderer;
  try {
    const props = { onCommandExecuted: () => {} };
    act(() => { renderer=TestRenderer.create(React.createElement(Terminal,props)); });
    act(() => { renderer.update(React.createElement(Terminal,{...props,commandToExecute:'cat about.txt'})); });
    assert.ok(!text(renderer).includes('sold my soul'));
    advance(clock,3000);
    assert.ok(text(renderer).includes('sold my soul'));
    assert.ok(text(renderer).includes('Snowy and Pluto'));
    assert.ok(renderer.root.findAllByType('img').some(img=>img.props.src==='/profilepicture.png .png'));
    act(() => { renderer.update(React.createElement(Terminal,{...props,commandToExecute:'cd projects'})); });
    advance(clock,4000);
    assert.ok(text(renderer).includes('ComputerOS'));
    assert.ok(text(renderer).includes('hover:scale-110'));
    assert.ok(text(renderer).includes('hover:animate-pulse'));
    act(() => { renderer.update(React.createElement(Terminal,{...props,commandToExecute:'cat experience.txt'})); });
    advance(clock,4000);
    assert.ok(text(renderer).includes('Lyft'));
    assert.ok(text(renderer).includes('Shopify'));
    act(() => { renderer.update(React.createElement(Terminal,{...props,commandToExecute:'cat research.txt'})); });
    advance(clock,4000);
    assert.ok(text(renderer).includes('AI & Statistics Researcher'));
    assert.ok(text(renderer).includes('Vector Institute'));
    assert.ok(text(renderer).includes('Statistical imaging'));
    assert.ok(text(renderer).includes('LLM evaluation'));
    assert.ok(text(renderer).includes('Computational genomics'));
    assert.ok(renderer.root.findAllByType('img').some(img=>img.props.src==='/vector_institute_logo.jpeg'));
    for (const id of ['2610.23912','2609.40190','2611.01461']) assert.ok(renderer.root.findAllByType('a').some(link=>link.props.href===`https://arxiv.org/abs/${id}`));
    act(() => { renderer.update(React.createElement(Terminal,{...props,commandToExecute:'cat publications.txt'})); });
    advance(clock,4000);
    assert.ok(text(renderer).includes('2611.01461'));
  } finally { if(renderer) act(()=>renderer.unmount()); clock.uninstall(); }
});

test('Desktop intro timing and minimize/maximize/restore interactions retain original window classes', () => {
  setupGlobals();
  const clock = FakeTimers.install({toFake:['setTimeout','clearTimeout','setInterval','clearInterval','Date']});
  let renderer;
  try {
    act(()=>{renderer=TestRenderer.create(React.createElement(Index));});
    advance(clock,2000);
    assert.ok(text(renderer).includes('sold my soul'));
    const windows=()=>renderer.root.findAll(n=>n.props['data-terminal-window']!==undefined);
    let terminal=windows()[0];
    act(()=>terminal.findByProps({title:'Maximize'}).props.onClick());
    assert.equal(windows()[0].props.className.includes('lg:col-span-1'),true);
    act(()=>windows()[0].findByProps({title:'Maximize'}).props.onClick());
    assert.equal(windows()[0].props.className.includes('lg:col-span-2'),true);
    act(()=>windows()[0].findByProps({title:'Minimize'}).props.onClick());
    assert.equal(windows()[0].props.className.includes('minimized-window'),true);
    act(()=>windows()[0].findByProps({title:'Minimize'}).props.onClick());
    assert.equal(windows()[0].props.className.includes('minimized-window'),false);
    const open=renderer.root.findAllByType('button').find(b=>b.findAllByType('div').some(child => child.children.includes('Open chai chat')));
    act(()=>open.props.onClick());
    advance(clock,500);
    assert.ok(text(renderer).includes('your chat buddy'));
    const chatWindow=()=>renderer.root.findAll(n=>n.props['data-chat-window']!==undefined)[0];
    act(()=>chatWindow().findByProps({title:'Minimize'}).props.onClick());
    assert.ok(chatWindow().props.className.includes('minimized-window'));
    act(()=>chatWindow().findByProps({title:'Minimize'}).props.onClick());
    assert.ok(!chatWindow().props.className.includes('minimized-window'));
    act(()=>chatWindow().findByProps({title:'Maximize'}).props.onClick());
    assert.ok(chatWindow().props.className.includes('lg:col-span-1'));
    act(()=>chatWindow().findByProps({title:'Close'}).props.onClick());
    advance(clock,500);
    assert.equal(chatWindow(),undefined);
  } finally {if(renderer)act(()=>renderer.unmount());clock.uninstall();}
});

test('Chai and AI Rep keep their original greetings, separate endpoints, pacing, and chat styling', () => {
  setupGlobals();
  for (const [Page,title,endpoint,greeting,delay] of [
    [ChaiPage,'chai','/chat/stream','your chat buddy',20],
    [RepPage,'ai rep','/recruiter/stream',"Neel's AI representative",15],
  ]) {
    let renderer;
    act(()=>{renderer=TestRenderer.create(React.createElement(MemoryRouter,null,React.createElement(Page)));});
    try {
      const chat=renderer.root.findByType(Chat);
      assert.equal(chat.props.title,title);
      assert.ok(chat.props.endpoint.endsWith(endpoint));
      assert.equal(chat.props.streamingDelayMs,delay);
      assert.ok(text(renderer).includes(greeting));
      assert.ok(text(renderer).includes('max-w-xs px-3 py-2 rounded-lg'));
      assert.ok(text(renderer).includes('text-xs opacity-70 mt-1'));
      assert.ok(!text(renderer).includes('New chat'));
      assert.equal(renderer.root.findByType('textarea').props.rows,1);
    } finally {act(()=>renderer.unmount());}
  }
});


test('The original wget progress animation completes and requests exactly one resume download', () => {
  setupGlobals();
  let downloads=0;
  globalThis.document.createElement=()=>({ click:()=>downloads++ });
  globalThis.document.body={appendChild:()=>{},removeChild:()=>{}};
  const clock=FakeTimers.install({toFake:['setTimeout','clearTimeout','setInterval','clearInterval','Date']});
  let renderer;
  try {
    const props={onCommandExecuted:()=>{}};
    act(()=>{renderer=TestRenderer.create(React.createElement(Terminal,props));});
    act(()=>renderer.update(React.createElement(Terminal,{...props,commandToExecute:'wget resume'})));
    advance(clock,6000);
    assert.ok(text(renderer).includes('100%'));
    assert.ok(text(renderer).includes('Resume downloaded successfully!'));
    assert.equal(downloads,1);
    advance(clock,2000);
    assert.equal(downloads,1);
  } finally {if(renderer)act(()=>renderer.unmount());clock.uninstall();}
});


test('Sending clears the composer permanently on success, stream failure, or network failure', async () => {
  const previousFetch=globalThis.fetch;
  for (const outcome of ['success','stream-error','network-error']) {
    setupGlobals();
    let resolveFetch, rejectFetch;
    globalThis.fetch=()=>new Promise((resolve,reject)=>{resolveFetch=resolve;rejectFetch=reject;});
    let renderer, sending;
    try {
      act(()=>{renderer=TestRenderer.create(React.createElement(Chat,{streamingDelayMs:0}));});
      const textarea=()=>renderer.root.findByType('textarea');
      act(()=>textarea().props.onChange({target:{value:'Sent message'}}));
      const sendButton=renderer.root.findAllByType('button').find(button=>button.children.includes('Send'));
      act(()=>{sending=sendButton.props.onClick();});
      assert.equal(textarea().props.value,'');
      // A draft typed while waiting must never be overwritten by a failing prior turn.
      act(()=>textarea().props.onChange({target:{value:'Next draft'}}));
      await act(async()=>{
        if(outcome==='network-error') rejectFetch(new TypeError('network disconnected'));
        else resolveFetch(new Response(outcome==='stream-error'
          ? 'data: {"error":"upstream failure","done":true}\n\n'
          : 'data: {"done":true}\n\n'));
        await sending;
      });
      assert.equal(textarea().props.value,'Next draft');
      if(outcome!=='success') assert.ok(text(renderer).includes('alert'));
    } finally {if(renderer)act(()=>renderer.unmount());}
    // Also verify an untouched empty input stays empty after the error.
    setupGlobals();
    let emptyRenderer, emptySending;
    globalThis.fetch=async()=>new Response('data: {"error":"failed","done":true}\n\n');
    try {
      act(()=>{emptyRenderer=TestRenderer.create(React.createElement(Chat));});
      act(()=>emptyRenderer.root.findByType('textarea').props.onChange({target:{value:'Original text'}}));
      await act(async()=>{
        emptySending=emptyRenderer.root.findAllByType('button').find(button=>button.children.includes('Send')).props.onClick();
        await emptySending;
      });
      assert.equal(emptyRenderer.root.findByType('textarea').props.value,'');
    } finally {if(emptyRenderer)act(()=>emptyRenderer.unmount());}
  }
  globalThis.fetch=previousFetch;
});
