const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseCsv, parseNokler } = require('./nokler.js');

test('parseCsv splits simple records and fields', () => {
    assert.deepEqual(parseCsv('a,b\nc,d'), [['a', 'b'], ['c', 'd']]);
});

test('parseCsv keeps commas inside quoted fields', () => {
    assert.deepEqual(parseCsv('a,"b, c"'), [['a', 'b, c']]);
});

test('parseCsv unescapes doubled quotes', () => {
    assert.deepEqual(parseCsv('"say ""hi"""'), [['say "hi"']]);
});

test('parseCsv lets quoted fields span lines', () => {
    assert.deepEqual(parseCsv('a,"line1\nline2"'), [['a', 'line1\nline2']]);
});

test('parseCsv normalises CRLF, ignores blank records and trailing newline', () => {
    assert.deepEqual(parseCsv('a,b\r\n\r\nc,d\r\n'), [['a', 'b'], ['c', 'd']]);
});

test('parseNokler skips header and returns entries in file order', () => {
    const text = 'navn,beskrivelse\nHovednøkkel,Ytterdør hjemme\nBod,Kjeller';
    assert.deepEqual(parseNokler(text), [
        { navn: 'Hovednøkkel', beskrivelse: 'Ytterdør hjemme' },
        { navn: 'Bod', beskrivelse: 'Kjeller' }
    ]);
});

test('parseNokler trims unquoted fields and preserves newlines in quoted description', () => {
    const text = 'navn,beskrivelse\n  Hytta  ,"Tre nøkler:\n- Ytterdør\n- Anneks"';
    assert.deepEqual(parseNokler(text), [
        { navn: 'Hytta', beskrivelse: 'Tre nøkler:\n- Ytterdør\n- Anneks' }
    ]);
});

test('parseNokler defaults missing description and skips entries without name', () => {
    const text = 'navn,beskrivelse\nPostkasse\n,Beskrivelse uten navn\nBod,';
    assert.deepEqual(parseNokler(text), [
        { navn: 'Postkasse', beskrivelse: '' },
        { navn: 'Bod', beskrivelse: '' }
    ]);
});

test('parseNokler returns empty list for empty text or header only', () => {
    assert.deepEqual(parseNokler(''), []);
    assert.deepEqual(parseNokler('navn,beskrivelse\n'), []);
});

test('parseNokler ignores extra columns', () => {
    assert.deepEqual(parseNokler('navn,beskrivelse,ekstra\nBod,Kjeller,x'), [
        { navn: 'Bod', beskrivelse: 'Kjeller' }
    ]);
});
