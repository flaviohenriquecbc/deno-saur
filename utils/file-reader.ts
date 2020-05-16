const readFileContents = (file: string) => {
    let fileContentsRaw = Deno.readFileSync(file);
    const decoder = new TextDecoder();
    let decoded = decoder.decode(fileContentsRaw);

    return decoded;
}


export {
    readFileContents
}