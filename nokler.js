// CSV parsing for the key overview. No DOM access, so it also loads under Node for tests.

(function (root) {
    function detectDelimiter(text) {
        const header = text.split(/\r?\n/, 1)[0];
        return header.includes(';') && !header.includes(',') ? ';' : ',';
    }

    function parseCsv(text) {
        const delimiter = detectDelimiter(text);
        const records = [];
        let fields = [];
        let field = '';
        let inQuotes = false;
        let wasQuoted = false;

        function endField() {
            fields.push(wasQuoted ? field : field.trim());
            field = '';
            wasQuoted = false;
        }

        function endRecord() {
            endField();
            if (fields.some(f => f !== '')) {
                records.push(fields);
            }
            fields = [];
        }

        const normalized = text.replace(/\r\n?/g, '\n');
        for (let i = 0; i < normalized.length; i++) {
            const ch = normalized[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (normalized[i + 1] === '"') {
                        field += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field += ch;
                }
            } else if (ch === '"') {
                inQuotes = true;
                wasQuoted = true;
            } else if (ch === delimiter) {
                endField();
            } else if (ch === '\n') {
                endRecord();
            } else {
                field += ch;
            }
        }
        endRecord();
        return records;
    }

    function parseNokler(text) {
        return parseCsv(text)
            .slice(1)
            .map(([navn = '', beskrivelse = '']) => ({ navn, beskrivelse }))
            .filter(entry => entry.navn !== '');
    }

    const api = { parseCsv, parseNokler };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        Object.assign(root, api);
    }
})(globalThis);
