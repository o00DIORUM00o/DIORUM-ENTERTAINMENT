const r = /    const handleSelectOption = \(option: string\) => \{[\s\S]*?        if \(mode === 'ERROR' || option === 'Goodbye' || option === 'GOODBYE' || option\.includes\('\(Leave\)'\)\) \{/;
console.log("Original regex matches empty:", r.test(""));
console.log("Source:", r.source);
